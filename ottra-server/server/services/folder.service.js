
const { aSureThing } = require('./../infra/await-to')
const FolderModel = require('./../models/folder.model')

const moveFile = require('move-file')
const fs = require('fs')
const fsPath = require('path')

const dirTree = require("directory-tree")

const FolderService = {
	createFolder: async function(user_id, payload) {
		console.debug("%s: createFolder called with payload: %O", __filename, payload)
		const { cwd, folderName } = payload
		const path = process.env.OTTRA_CONTENT_PATH + "/" + user_id + "/" + cwd + "/" + folderName
		console.debug("%s: createFolder built pathname: %s", __filename, path)
		fs.mkdir(path, { recursive: false }, (err) => {
				return { ok: false, error: { code: 500, status: 'failed', message: err } }
			}
		)
		return { ok: true, data: path }
	},
	getFolderTree: async function(user_id) {
		const startPath = process.env.OTTRA_CONTENT_PATH + "/" + user_id
		const theTree = dirTree(startPath, { attributes: ['mtime', 'ctime'] })

		theTree.children = removeFilesFromTree(theTree.children)
		theTree.path = "/"
		theTree.children = rewritePaths(theTree.children)

		function removeFilesFromTree(children) {
			return children.filter(function(ent) {
				if (ent.type === 'file') {
					return 0
				} else {
					ent.children = removeFilesFromTree(ent.children)
					return 1
				}
			})
		}

		/* This function, sorta, is internally used in two functions. Here and in DocumentModel. 
		   It might be ripe for refactoring. TODO
		*/
		function rewritePaths(children) {
			return children.map(function(ent) {
				ent.path = ent.path.substring(startPath.length)
				return ent
			})
		}

		console.debug(theTree)
		return { ok: true, data: theTree }
	},
	moveFolder: async function(user_id, payload) {

	},
	deleteFolder: async function(user_id, payload) {

	},
}

module.exports = FolderService

/* Probably deprecated - saving for possible code recovery...
	getAllFoldersAndFiles: async function(user_id) {
		function flatten(lists) {
			console.debug("%s: flatten: %O", __filename, lists)
			return lists.reduce((a, b) => a.concat(b), [])
		}

		function getDirectories(path) {
			console.debug("%s: getDirectories: %O", __filename, path)
			return fs.readdirSync(path)
				.map(file => fsPath.join(path, file))
				.filter(thePath => fs.statSync(thePath).isDirectory())
		}

		function getDirectoriesRecursive(path) {
			console.debug("%s: getDirectoriesRecursive: %O", __filename, path)
			return [path, ...flatten(getDirectories(path).map(getDirectoriesRecursive))]
		}

		return { 
			ok: true, 
			data: getDirectoriesRecursive(startPath).map(function(pathName) {
				return pathName.substring(startPath.length)
			}) 
		}
	},

	getFolderTree: async function(user_id) {

		const startPath = process.env.OTTRA_CONTENT_PATH + "/" + user_id

		function flatten(lists) {
			console.debug("%s: flatten: %O", __filename, lists)
			return lists.reduce((a, b) => a.concat(b), [])
		}

		function getDirectories(path) {
			console.debug("%s: getDirectories: %O", __filename, path)
			return fs.readdirSync(path)
				.map(file => fsPath.join(path, file))
				.filter(thePath => fs.statSync(thePath).isDirectory())
		}

		function getDirectoriesRecursive(path) {
			console.debug("%s: getDirectoriesRecursive: %O", __filename, path)
			return [path, ...flatten(getDirectories(path).map(getDirectoriesRecursive))]
		}

		return { 
			ok: true, 
			data: getDirectoriesRecursive(startPath).map(function(pathName) {
				return pathName.substring(startPath.length)
			}) 
		}

		return { ok: true, data: dirTree(startPath) }
	}
*/