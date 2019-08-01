#!/usr/bin/perl

use strict;
use warnings;
use diagnostics;

use utf8;

use Data::Dumper;
use JSON;
use REST::Neo4p;

my $data;
my $node_ob_store;


readJSONFile($data);

# Handle Locations first:

# Create connection
REST::Neo4p->connect('http://192.168.1.200:7474', 'neo4j', 'neo4j3.5');

# Clear out database, or not
cleanNeo4JDatabase(1);

my $locs = $data->{'Locations'};
for my $loc_ob (@{$locs}) {
	print "Handling task objects.\n";
	#print "Location object found:\n", Dumper($loc_ob), "\n"; 
	
	# Gathering Location Node attributes
	my $loc = createLocationNode($loc_ob->{'Name'});
	my $geoloc = createGeoLocationNode($loc_ob->{'Geolocation'});
	my $geoloc_r = $loc->relate_to($geoloc, "LOCATION");

	my $addr = createAddressNode($loc_ob->{'Address'});
	my $addr_r = $loc->relate_to($addr, "ADDRESS");

	for my $room_ob (@{$loc_ob->{'Rooms'}}) {
		my $room = createRoomNode($room_ob->{'Name'});
		my $room_r = $loc->relate_to($room, "HOUSES");
		if (exists $room_ob->{'Storages'}) {
			for my $store_ob (@{$room_ob->{'Storages'}}) {
				my $tmp_ob = createStorageNode($store_ob);
				my $tmp_r = $room->relate_to($tmp_ob, "HAS");
				if (exists $store_ob->{'Actions'}) {
					for my $act_ob (@{$store_ob->{'Actions'}}) {
						my $act = createActionNode($act_ob->{'Action'});
						my $act_r = $tmp_ob->relate_to($act, "CAN");
					}
				}
				if (exists $store_ob->{'Equipment'}) {
					for my $eq_ob (@{$store_ob->{'Equipment'}}) {
						my $eq = createEquipmentNode($eq_ob->{'Name'});
						my $eq_r = $tmp_ob->relate_to($eq, "HOLDS");
					}
				}
			}
		}
	}
}

my $families = $data->{'Family'};
print "Families: ", Dumper($families), "\n";
for my $family (@{$families}) {
	print "Family: ", Dumper($family), "\n";
	my $f_node = createFamilyNode($family);
	for my $member (@{$family->{'FamilyMembers'}}) {
		print "Familymember: ", Dumper($member), "\n";
		my $m_node = createUserNode($member);
		$m_node->relate_to($f_node, "BELONG_TO");
	}
}

my $tasks = $data->{'Tasks'}; # array of hashref-tasks
handleTasks($tasks);


##############################################################################
### Subroutines
##############################################################################
sub createUserNode {
	my ($member) = shift;

	my $m_ob = REST::Neo4p::Node->new($member);
	$m_ob->add_labels('User');
	$node_ob_store->{'User'}->{$member->{'username'}} = $m_ob;
	return $m_ob;
}

sub createFamilyNode {
	my ($fam) = shift;

	my $m_ob = REST::Neo4p::Node->new(({ 
		'residency' => $fam->{"Residency"},
		'name' => $fam->{"Name"}
	}));
	$m_ob->add_labels('Family');

	my $r_ob = $node_ob_store->{'Location'}->{$fam->{"Residency"}};
	my $r_rel = $m_ob->relate_to($r_ob, "LIVES_AT");
	return $m_ob;
}

sub handleTasks {
	my $tasklist = shift;
	my $parent_ob = shift || undef;
	my $step_no = 1;

	for my $single_task (@{$tasklist}) {
		my $t_ob = handleTask($single_task->{'Task'}); # task hashref
		if (defined $parent_ob) {
			my $rel = $parent_ob->relate_to($t_ob, "SUBTASK")->set_property({ order => $step_no++ });
		}
	}
}

sub handleTask {
	my $task = shift;

	my $t_ob = createTask($task->{'Name'}, $task->{'Creator'});
	if (exists $task->{'Tasks'}) {
		handleTasks($task->{'Tasks'}, $t_ob);
	} else {
		my $step_no = 1;
		for my $single_step (@{$task->{'Steps'}}) {
			my $s_ob = createStep($single_step);
			my $t_r = $t_ob->relate_to($s_ob, "EXECUTES")->set_property({ order => $step_no++ });
		}
	}
	return $t_ob;
}

sub createTask
{
	my ($name) = shift;
	my ($creator) = shift;

	my $t_ob = REST::Neo4p::Node->new({ 'name' => $name });
	$node_ob_store->{'Task'}->{$name} = $t_ob;
	my $creator_ob = $node_ob_store->{'User'}->{$creator};
	$creator_ob->relate_to($t_ob, "OWNS");
	$t_ob->add_labels('Task');

	return $t_ob;
}

sub createStep 
{
	my ($attr) = shift;
  
  print "Creating node with:\n\t",
  	"Description: ", $attr->{'Description'}, "\n\t",
  	"Duration: ", $attr->{'Duration'}, "\n";

	my $s_ob = REST::Neo4p::Node->new({
		description => $attr->{'Description'},
		duration => $attr->{'Duration'}
	});
	if (exists $attr->{'Options'}) { # Bad name. It's not an option...
		for my $act (keys %{$attr->{'Options'}}) {
			my $a_node = createActionNode($act);
			$s_ob->relate_to($a_node, "OPTION");
		}
	}
	if (exists $attr->{'Equipment'}) { 
		for my $eq (@{$attr->{'Equipment'}}) {
			my $eq_node = $node_ob_store->{'Equipment'}->{$eq->{'Name'}};
			if (defined $eq_node) {
				$s_ob->relate_to($eq_node, "REQUIRES");
			} else {
				print "Missing EQUIPMENT (", $eq->{'Name'}, ").\n";
			}
		}		
	}
	if (exists $attr->{'Destination'}) {
		my $loc_node = undef;

		my $href = $attr->{'Destination'};
		if (exists $href->{'Storage'}) {
			$loc_node = $node_ob_store->{'Storage'}->{$href->{'Storage'}};
		} elsif (exists $href->{'Room'}) {
			$loc_node = $node_ob_store->{'Room'}->{$href->{'Room'}};
		} elsif (exists $href->{'Location'}) {
			$loc_node = $node_ob_store->{'Location'}->{$href->{'Location'}};
		}
		if (defined $loc_node) {
			$s_ob->relate_to($loc_node, "MOVE_TO");
		}
	}
	if (exists $attr->{'Target'}) {
		my $loc_node = undef;

		$loc_node = $node_ob_store->{'Storage'}->{$attr->{'Target'}};
		if (defined $loc_node) {
			$s_ob->relate_to($loc_node, "USES");
		}
	}
	$s_ob->add_labels('Step');
	return $s_ob;
}

sub createActionNode
{
	my ($name) = shift;

	my $a_ob = REST::Neo4p::Node->new({ name => $name });
	$node_ob_store->{'Action'}->{$name} = $a_ob;
	$a_ob->add_labels('Action');

	return $a_ob;
}

sub createEquipmentNode
{
	my ($name) = shift;

	my $e_ob = REST::Neo4p::Node->new({ name => $name });
	$node_ob_store->{'Equipment'}->{$name} = $e_ob;
	$e_ob->add_labels('Equipment');

	return $e_ob;
}

sub createRoomNode 
{
	my ($name) = shift;

	my $r_ob = REST::Neo4p::Node->new({ name => $name });
	$node_ob_store->{'Room'}->{$name} = $r_ob;
	$r_ob->add_labels('Room');

	return $r_ob;
}

sub createStorageNode 
{
	my ($attr) = shift;

	my $store_ob = REST::Neo4p::Node->new({ name => $attr->{'Name'}});
	$node_ob_store->{'Storage'}->{$attr->{'Name'}} = $store_ob;
	$store_ob->add_labels('Storage');

	return $store_ob;
}

sub createLocationNode
{
	my ($name) = shift;

	my $loc_ob = REST::Neo4p::Node->new({ name => $name });
	$node_ob_store->{'Location'}->{$name} = $loc_ob;
	$loc_ob->add_labels('Location');

	return $loc_ob;
}

sub createGeoLocationNode
{
	my ($coords) = shift;

	my $geoloc_ob = REST::Neo4p::Node->new( $coords );
	$geoloc_ob->add_labels('Geolocation');

	return $geoloc_ob;
}

sub createAddressNode
{
	my ($addr) = shift;

	my $addr_ob = REST::Neo4p::Node->new( $addr );
	$addr_ob->add_labels('Address');

	return $addr_ob;
}

sub readJSONFile
{
	my $json = JSON->new->allow_nonref;

	my $json_filename = shift @ARGV;

	open F, $json_filename or die $!;
	my @file = <F>;
	close(F);

	my $json_str = join("\n", @file);
	@_[0] = $json->utf8->decode($json_str);
}

sub cleanNeo4JDatabase
{
	my $bool = shift;
	if ($bool) {
		my $query = REST::Neo4p::Query->new("MATCH (n) DETACH DELETE n");
		$query->execute;
	}
}

