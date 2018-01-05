//modules required for the tasks to compile
var browserify = require("browserify"),
    es = require('event-stream'),
    gulp = require('gulp'),
    prefix = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    plugins = require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }), 
    modernizr = require('gulp-modernizr');
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename"),
    ts = require("gulp-typescript"),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    sassdoc = require('sassdoc'),
    tsProject = ts.createProject("tsconfig.json"),
    buffer = require('vinyl-buffer'),    
    source = require('vinyl-source-stream');
    

var basePaths = {
    src: 'app/',
    dest: 'dist/',
    projPrefix: ''
};

var paths = {
    libs: {
        src: basePaths.src + 'js/libs/',
        dest: basePaths.dest + 'js/'
    },    
    scripts: {
        src: basePaths.src + 'js/',
        dest: basePaths.dest + 'js/'
    }, 
    styles: {
        src: basePaths.src + 'scss/',
        dest: basePaths.dest + 'css/'
    },
    images: {
        src: basePaths.src + 'img/',
        dest: basePaths.dest + 'img/'
    },
    sprite: {
        src: basePaths.src + 'img/sprite/*'
    },    
    pages: [
            basePaths.src + 'index.html',
            basePaths.src + 'templates/**/*.html'
        ],
    fonts: {
        src: basePaths.src + 'fonts/',
        dest: basePaths.dest + 'fonts/'
    }        
};

var appFiles = {
    styles: paths.styles.src + '**/*.scss',
    scripts: [paths.scripts.src + '*.js'],
    images: paths.images.src + '**/*.+(png|jpg|jpeg|gif|svg)',
    fonts: paths.fonts.src + '**/*'
};

var spriteConfig = {
    retinaSrcFilter: [paths.sprite.src + '*@2x.png'],
    retinaImgName: basePaths.projPrefix +'sprite@2x.png',
    retinaImgPath: '/' + paths.images.dest + basePaths.projPrefix + 'sprite@2x.png', // Gets put in the scss
    imgName:  basePaths.projPrefix + 'sprite.png',
    imgPath: '/' + paths.images.dest + basePaths.projPrefix + 'sprite.png', // Gets put in the scss
    cssName: '_spritesheet.scss',
    cssPath: '/components/',
    padding: 0
};

//checks if --production flag is true or false
var config = {
    production: !!gutil.env.production, //two exclamations turn undefined into a proper false
    sourceMaps: !plugins.util.env.production
};

//config based on whether it is production or development
if(!config.production) {
    //development settings
    var debugEnv = true,
        sassStyle = 'expanded'
} else {
    //production settings
    debugEnv = false,
    sassStyle = 'compressed'
}


//Modernizr
//Feature detection
gulp.task('modernizr', function() {
  gulp.src(paths.scripts.dest + basePaths.projPrefix + 'built.js')
    .pipe(modernizr({
        "tests" : ['html5printshiv']
    }))
    .pipe(config.production ? plugins.uglify() : gutil.noop())    
    .pipe(gulp.dest(paths.scripts.dest))
});


//Libs
//Converts all the libraries into a single minifed file
gulp.task("libs", function () {
    gulp.src([
                'node_modules/jquery.2/node_modules/jquery/dist/jquery.js',
                'node_modules/d3/build/d3.js'
            ])
    .pipe(concat(basePaths.projPrefix + 'libs.js'))
    .pipe(config.production ? plugins.uglify() : gutil.noop())
    .pipe(gulp.dest(paths.libs.dest))
});
    

//Typescript
//Converts typescript to javascript
gulp.task("typescript", function () {
    return tsProject.src()
    .pipe(tsProject())      
    .js.pipe(gulp.dest(paths.scripts.src))
    .pipe(concat(basePaths.projPrefix + 'built.js'))
    .pipe(gulp.dest(paths.scripts.src));
});


//Browserify
//Browserifies the built.js file
gulp.task('browserify', ['typescript'], function(done) {
    return browserify({
         entries: [ paths.scripts.src + basePaths.projPrefix + 'built.js'],
         debug :  debugEnv
    })
    .bundle()
    .on('error', function (e){
        gutil.log(e);
    })    
    .pipe(source(basePaths.projPrefix + 'built.js'))
    .pipe(buffer())  
    .pipe(config.production ? plugins.uglify() : gutil.noop())
    .pipe(gulp.dest(paths.scripts.dest));
});


//Styles Task
//Compiles SASS into CSS and prefixes CSS
gulp.task('styles', function () {
    return gulp.src(appFiles.styles)
    .pipe(config.sourceMaps ? sourcemaps.init(): gutil.noop())
    .pipe(sass({outputStyle: sassStyle}).on('error', sass.logError))
    .pipe(prefix({
        browsers: ['last 2 versions', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
    }))         
    .pipe(config.sourceMaps ? sourcemaps.write(): gutil.noop())
    .pipe(rename(basePaths.projPrefix + 'global.css'))
    .pipe(gulp.dest(paths.styles.dest));
});

//Sprite
//Converts all pngs within sprite folder and creates a spritesheet from it
gulp.task('sprite', function () {
    var spriteData = gulp.src(paths.sprite.src).pipe(plugins.spritesmith({
        retinaSrcFilter: spriteConfig.retinaSrcFilter,
        retinaImgName: spriteConfig.retinaImgName,
        imgName: spriteConfig.imgName,
        cssName: spriteConfig.cssName,
        imgPath: spriteConfig.imgPath,
        cssVarMap: function (sprite) {
            sprite.name = 'sprite-' + sprite.name;
        },
        padding: spriteConfig.padding
    }));
    spriteData.img.pipe(gulp.dest(paths.images.src));
    spriteData.css.pipe(gulp.dest(paths.styles.src + spriteConfig.cssPath));
});

//Image Task
//Compress
gulp.task('images', ['sprite'], function(){
    return gulp.src(appFiles.images)
    .on('error', function (e){
        gutil.log(e);
    })
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
});


//Copy Task
//Copies files from one location to another
gulp.task('copy', function() {

  //html
  gulp.src(paths.pages, {base: './app'})
  .on('error', function (e){
    gutil.log(e);
  })  
  .pipe(gulp.dest(basePaths.dest))

  //fonts
  gulp.src(appFiles.fonts)
  .on('error', function (e){
    gutil.log(e);
  })  
  .pipe(gulp.dest(paths.fonts.dest))

})


//Watch Task
gulp.task('watch', ['images', 'styles', 'libs', 'typescript', 'browserify', 'modernizr', 'copy'], function(){
  gulp.watch(appFiles.styles, ['styles']);
  gulp.watch('app/ts/**/*.ts', ['typescript', 'browserify']); 
});


//SassDoc Task
//Documentation
gulp.task('sassdoc', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sassdoc({ dest: 'docs/sass'}));
});


gulp.task('default', ['images','styles', 'libs', 'typescript', 'browserify', 'modernizr', 'copy']); //deploy files, for production include '--production' i.e. gulp --production
gulp.task("docs",['sassdoc']); //creates documentation for sass