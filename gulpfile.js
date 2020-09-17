const { src, dest } = require('gulp');

function copyAssets() {
	return src('./src/others/status.html').pipe(dest('./dist/src/others'));
}

function defaultTask(cb) {
	copyAssets();
	cb();
}

exports.default = defaultTask;
