let gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    vendor = require('gulp-concat-vendor'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    htmlbeautify = require('gulp-html-beautify')
    order = require("gulp-order"),
    imagemin = require('gulp-imagemin'),
    notify = require("gulp-notify"),
    gulpCopy = require('gulp-copy'),
    babel = require('gulp-babel');

const libsOrder = [
    'assets/libs/jquery-3.3.1.min.js',
    'assets/libs/*.js',
]

const config = {
    input: {
        html: './*.html',
        fonts: './assets/fonts/**/*',
        images: './assets/images/**/*',
        scss: {
            app: './assets/scss/app.scss',
            libs: './assets/scss/libs.scss'
        },
        js: {
            app: './assets/js/app.js',
            libs: './assets/libs/**/*.js',
        }
    },
    output: {
        html: './build/',
        fonts: './build/fonts/',
        images: './build/images/',
        css: {
            app: './build/css/',
            libs: './build/css/'
        },
        js: {
            app: './build/js/',
            libs: './build/libs/',
        }
    }
}

const sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

const autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};



/*--------  Tasks  --------*/

gulp.task('default', ['serve']);

gulp.task('serve', ['sass_libs', 'sass_app', 'js_libs', 'js_app', 'images', 'fonts', 'html'], function() {
    browserSync.init({
        server: {
            baseDir: "./build/",
        }
    });

    gulp.watch(config.input.scss.app, ['sass_app']);
    gulp.watch(config.input.scss.libs, ['sass_libs']);
    gulp.watch(config.input.js.app, ['js_app']);
    gulp.watch(config.input.js.libs, ['js_libs']);


    gulp.watch("assets/scss/**/*.scss", ['sass_app']);
    gulp.watch("assets/scss/**/*.scss", ['sass_libs']);
    gulp.watch(config.input.html, ['html']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('build', ['clean', 'set-prod-node-env'], function() {
    gulp.run(['sass_libs', 'sass_app', 'js_libs', 'js_app', 'fonts', 'images', 'html'])
})

gulp.task('sass_app', function() {

    if (process.env.NODE_ENV !== 'production') {
        return gulp
            .src(config.input.scss.app)
            .pipe(sourcemaps.init())
            .pipe(sass(sassOptions).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(cleanCSS({compatibility: 'ie11'}))
            .pipe(sourcemaps.write('./maps'))
            .pipe(gulp.dest(config.output.css.app))
            .pipe(browserSync.stream())
    } else {
        return gulp
            .src(config.input.scss.app)
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(cleanCSS({compatibility: 'ie11'}))
            .pipe(gulp.dest(config.output.css.app));
    }
});

gulp.task('sass_libs', function() {
    if (process.env.NODE_ENV !== 'production') {
        return gulp
            .src(config.input.scss.libs)
            .pipe(sourcemaps.init())
            .pipe(sass(sassOptions).on('error', sass.logError))
            .pipe(sourcemaps.write('./maps'))
            .pipe(gulp.dest(config.output.css.libs))
    } else {
        return gulp
            .src(config.input.scss.libs)
            .pipe(sass(sassOptions).on('error', sass.logError))
            .pipe(gulp.dest(config.output.css.libs))
    }
});


gulp.task('js_libs', function() {
    return gulp
        .src(config.input.js.libs)
        .pipe(uglify())
        .pipe(order(libsOrder, { base: './' }))
        .pipe(vendor('libs.js'))
        .pipe(gulp.dest(config.output.js.libs));
  });

gulp.task('js_app', function() {
    gulp.src(config.input.js.app)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.output.js.app))
})

gulp.task('html', function() {
    return gulp.src(config.input.html)
        .pipe(htmlbeautify({indentSize: 2}))
        .pipe(gulp.dest(config.output.html));
});

gulp.task('fonts', function() {
    return gulp.src(config.input.fonts)
        .pipe(gulp.dest(config.output.fonts));
});

gulp.task('images', function() {
    gulp.src(config.input.images)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(config.output.images))
});



gulp.task('set-prod-node-env', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});