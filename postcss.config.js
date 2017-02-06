/**
 * @author Loserfucker<lihx_hit@163.com>
 * @date 2017/2/4
 * @description
 */
module.exports = {
    plugins: [
        require('postcss-fixes')(),
        require('autoprefixer')(),
        require('cssnano')({
            'safe': true, // I would recommend using cssnano only in safe mode
            'calc': false // calc is no longer necessary, as it is already done by postcss-fixes due to precision rounding reasons
        })]
}