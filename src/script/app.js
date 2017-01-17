/**
 * @author Loserfucker<lihx_hit@163.com>
 * @date 2017/1/5
 * @description
 */
require('../style/common.less');
require('../style/app.less');

// if(process.env.NODE_ENV === '???'){
//     console.log('!!')
// }else{
//     alert('prod!')
// }
// console.log($('html'));
if (module.hot) {
    module.hot.accept();
}
