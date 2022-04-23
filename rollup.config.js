const path = require('path')

const buble = require('@rollup/plugin-buble') // 代码转换库
const replace = require('@rollup/plugin-replace') // 汇总插件，替换文件中的目标字符串
const {nodeResolve} = require('@rollup/plugin-node-resolve')  // node 下路径解析
const commonjs = require('@rollup/plugin-commonjs') // 加载 Node.js 里面的 CommonJS 模块
const {terser} = require("rollup-plugin-terser") // 代码压缩插件

const pkg = require('./package.json')

const banner = `/*!
 * test mode
 * @license MIT
 */`

function createEntries() {

    /**
     * @param {String} input - 入口文件路径
     * @param {String} file - 输出文件路径
     * @param {String} format - 输出格式: es iife commonjs
     * @param {Boolean} minify - 代码是否压缩
     */
    const configs = [
        // {input: 'src/test.js', file: 'dist/test.es.js', format: 'es', minify: false, browser: true, env: 'development'},
        // {input: 'src/test.js', file: 'dist/test.commonjs.js', format: 'commonjs', browser: true, env: 'development'},
        {input: 'src/index.js', file: 'dist/index.mjs.js', format: 'es', minify: false, browser: true, env: 'development'},
        {input: 'src/index.cjs.js', file: 'dist/index.cjs.js', format: 'cjs', minify: false, browser: true, env: 'development'}
    ]

    const createEntry = config => {

        const isGlobalBuild = config.format === 'iife'
        const isBundlerBuild = config.format !== 'iife' && !config.browser
        const isBundlerESMBuild = config.format === 'es' && !config.browser

        const opt = {
            // external: ['vue'], 将模块 ID 的逗号分隔列表排除
            input: config.input, // 入口文件
            plugins: [
                buble({
                    transforms: {
                        forOf: false // 忽略 for-of 语法
                    }
                }),
                nodeResolve(),
                commonjs(),
                replace({
                    __VERSION__: pkg.version
                })
            ],
            output: {
                banner, // 顶部说明头
                file: config.file,
                format: config.format,
                globals: {
                    // vue: 'Vue'
                }
            },
            onwarn: (msg, warn) => {
                // 警告信息拦截
            //     if (!/Circular/.test(msg)) {
            //     warn(msg)
            //     }
            }
        }

        // if (isGlobalBuild) {
        //     c.output.name = c.output.name || 'Vuex' // 生成 UMD 模块的名字
        // }

        // if (!isGlobalBuild) {
        //     c.external.push('@vue/devtools-api')
        // }

        // opt.plugins.push(replace({
        //     preventAssignment: true,
        //     __VERSION__: pkg.version,
        // //   __DEV__: isBundlerBuild
        // //     ? `(process.env.NODE_ENV !== 'production')`
        // //     : config.env !== 'production',
        // //   __VUE_PROD_DEVTOOLS__: isBundlerESMBuild
        // //     ? '__VUE_PROD_DEVTOOLS__'
        // //     : 'false'
        // }))

        if (config.minify) opt.plugins.push(terser({module: config.format === 'es'}))

        return opt
    }
    return configs.map(opt => createEntry(opt))
}

module.exports = createEntries()