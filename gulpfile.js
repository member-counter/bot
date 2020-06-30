const { src, dest } = require('gulp');

function copyAssets() {
	return src('src/**/*').pipe(dest('dist/'));
}

function defaultTask(cb) {
	copyAssets();
	cb();
}

exports.default = defaultTask;
