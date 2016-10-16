var path = require('path');
var runSequence = require('run-sequence');
var del = require('del');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat')
var rename = require('gulp-rename');
const tslint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');

var fileConfigs = {
    'bundle': {
        'outputDirectory': 'dist',
        'mainIndexFile': 'index.html'
    },
    'server': {
        sourceTsFiles: ['server/src/**/*.ts', 'server/typings/index.d.ts'],
        ignoreTsFiles: [],
        tsConfigFile: 'server/tsconfig.json',
        additionConfigs: 'server/config.json'
    },
    'client': {
        sourceTsFiles: ['client/**/*.ts'],
        sourceHtmlFiles: ['client/**/*.html'],
        additionalFilesToCopy: ['client/systemjs.config.js'],
        ignoreTsFiles: [],
        tsConfigFile: 'client/tsconfig.json',
        mainIndexFile: 'client/index.html'
    }
};

// SERVER
gulp.task('clean', function () {
    return del(fileConfigs.outputDirectory)
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', function (tsFiles) {
    return gulp.src(tsFiles)
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report());
});

gulp.task('build:server', function () {
    var tsProject = ts.createProject(fileConfigs.server.tsConfigFile);

    var tsResult = gulp.src(fileConfigs.server.sourceTsFiles)
        /*.pipe(sourcemaps.init())*/
        .pipe(ts(tsProject))

    return tsResult.js
        /*.pipe(sourcemaps.write())*/
        .pipe(gulp.dest(fileConfigs.bundle.outputDirectory));

});

gulp.task('build:server:copyConfigFiles', function () {
    return gulp.src(fileConfigs.server.additionConfigs)
        .pipe(gulp.dest(fileConfigs.bundle.outputDirectory));
});

// CLIENT
/**
 * Copy all required libraries into build directory.
 */
gulp.task('build:libs', function () {

    var dependencies = [
        'angular2/bundles/angular2-polyfills.js',
        'systemjs/dist/system.src.js',
        'rxjs/bundles/Rx.js',
        'angular2/bundles/angular2.dev.js',
        'angular2/bundles/router.dev.js'
    ];

    var mappedPaths = dependencies.map(file => { return path.resolve('node_modules', file) })

    //Let's copy our head dependencies into a dist/libs
    gulp.src(mappedPaths, { base: 'node_modules' })
        .pipe(gulp.dest(fileConfigs.bundle.outputDirectory + "/libs"))

});

gulp.task('build:index', function () {
    //Let's copy our index into dist   
    var copyIndex = gulp.src(fileConfigs.client.mainIndexFile)
        .pipe(rename(fileConfigs.bundle.mainIndexFile))
        .pipe(gulp.dest(fileConfigs.bundle.outputDirectory));

    //copy all config files   
    var copyConfigFiles = gulp.src(fileConfigs.client.additionalFilesToCopy)
        .pipe(gulp.dest(fileConfigs.bundle.outputDirectory));

    return [copyIndex, copyConfigFiles];
});

gulp.task('build:app', function () {
    var tsProject = ts.createProject(fileConfigs.client.tsConfigFile);

    var tsResult = gulp.src(fileConfigs.client.sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))

    return tsResult.js
        .pipe(sourcemaps.write(".", { sourceRoot: '/client' }))
        .pipe(gulp.dest(fileConfigs.bundle.outputDirectory))
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("build:resources", () => {
    return gulp.src(["client/**/*", "!**/*.ts"])
        .pipe(gulp.dest(fileConfigs.bundle.outputDirectory));
});



/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch:all', function () {
    gulp.watch(fileConfigs.client.sourceTsFiles, ['build:app']).on('change', function (e) {
        console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
    });

    gulp.watch(fileConfigs.client.sourceHtmlFiles, ['build:index']).on('change', function (e) {
        console.log('Html file ' + e.path + ' has been changed, bundling again.');
    });

    gulp.watch(fileConfigs.server.sourceTsFiles, ['build:server:all']).on('change', function (e) {
        console.log('TypeScript file ' + e.path + 'in server module has been changed. Compiling.');
    });
});

gulp.task('build:client:all', ['build:app', 'build:index', 'build:libs']);
gulp.task('build:server:all', ['build:server', 'build:server:copyConfigFiles']);


gulp.task('build', function (callback) {
    runSequence('clean', 'build:server:all', 'build:client:all', 'watch:all', callback);
});

gulp.task('default', ['build']);