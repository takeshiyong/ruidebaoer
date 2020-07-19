'use strict'
module.exports = {
    NODE_ENV: '"production"',

    //公司公共环境
    // BASE_API: '"http://192.168.1.224:1001"',
    // FILE_API: '"http://192.168.1.224:8240"',
    // PREVIEW_API: '"http://192.168.1.220:8888/"',

    // 正式部署环境
    // BASE_API: '"http://39.98.38.66:1001"',
    // FILE_API: '"http://39.98.38.66:8240"',
    // PREVIEW_API: '"http://39.98.74.88:8888/"',
    // PLAY_URL: '"http://10.103.100.10:10800"',
    // LOCATION_URL: '"192.168.1.224"',
    BASE_API: '"http://192.168.1.224:1001"',
    FILE_API: '"http://192.168.1.224:8240"',
    PREVIEW_API: '"http://192.168.1.220:8888/"',
    PLAY_URL: '"http://192.168.1.224:10800"',
    LOCATION_URL: '"192.168.1.224"',
    // 设置视频请求失败的二次请求问题 false 不做二次请求  true做二次请求
    RE_REQUEST: 'true'
}
