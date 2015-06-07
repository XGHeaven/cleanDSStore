var fs = require('fs'),
	path = require('path'),
	program = require('commander'),
	q = require('q'),

	// command line color
	colors = require('colors'),
	
	startPath = process.cwd(),

	// statis
	statis = {
		totalFiles: 0,
		cleanFiles: 0,
		needToClean: 0
	}

function show(msg) {
	console.log(msg.grey);
}
function info(msg) {
	console.log(msg.blue);
}
function warning(msg) {
	console.log(msg.yellow);
}
function error(msg) {
	console.log(msg.red);
}
function status(msg) {
	console.log(msg.cyan.underline)
}

program
	.version('0.1.0')
	.option('-q, --quiet', 'quiet delete')
	.option('-p, --path <path>', 'select path to clean')
	.allowUnknownOption(true)
	.parse(process.argv);

if (program.path) {
	startPath = path.resolve(startPath, program.path);
}


function clean(path) {
	var files;

	try {
		files = fs.readdirSync(path);
	} catch(e) {
		if (e.errno != -20) {
			error('read files in ' + path + ' error');
		} else {
			statis.totalFiles ++ ;
		}
		return;
	}

	for (var k of files) {
		if (k === '.DS_Store') {
			statis.needToClean ++ ;
			statis.totalFiles ++ ;
			try {
				fs.unlinkSync(path + '/' + k);
				statis.cleanFiles ++ ;
				!program.quite && info('clean' + path);
			} catch(e) {
				error('clean files error for ' + path + '/' + k);
				continue;
			}
		} else {
			clean(path + '/' + k);
		}
	}

}

show('start clean path: ' + startPath);

clean(startPath);

status('find files:\t' + statis.totalFiles);
status('need to clean:\t' + statis.needToClean);
status('cleaned:\t' + statis.cleanFiles);
status('clean error:\t' + (statis.needToClean - statis.cleanFiles));

show('clean over');