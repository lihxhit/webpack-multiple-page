/**
 * @author Loserfucker<lihx_hit@163.com>
 * @date 2016/12/29
 * @description
 */
require('../style/common.less');

if(process.env.NODE_ENV === '???'){
    console.log('!!')
}else{
    alert('prod!')
}

if (module.hot) {
    module.hot.accept();
}
