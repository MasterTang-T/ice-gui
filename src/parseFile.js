const fs = require('fs')
const path = require('path')
const os = require('os')
const handlebars = require('handlebars')
const Desktop = path.join(os.homedir(), "Desktop")
let clientJSPath = '';
let iceBusinessJSPath = '';
let iceBusinessJSONPath = '';
function parseFile(arg) {
    const {
        path,
        filename
    } = arg
    if (path.includes('.ice')) {
        let clientPath = Desktop + `/${filename}`;
        clientPath = clientPath.replace('.ice', '.json')
        iceBusinessJSONPath = clientPath
        if (fs.existsSync(path)) {
            const fileContent = fs.readFileSync(path, 'utf-8').toString()
            const fileDealData = fileDealFunc(fileContent)
            fs.writeFileSync(clientPath, fileDealData)
            renderClientJS(clientPath,filename)
            renderIceJS(clientPath)
           
        }
    }
    return {
        clientJSPath,
        iceBusinessJSPath,
        iceBusinessJSONPath
    }
}
// 渲染 ice对应的js模板
const renderIceJS = (iceJsonPath) => {
    const fileData = JSON.parse(fs.readFileSync(iceJsonPath).toString());
    const ICE_JS_PATH = iceJsonPath.replace('.json','.js')
    // 处理参数数组文件，写入对应的js模板中
    const ICE_JS_TEMPLATE = path.resolve(__dirname, 'template/IceBusiness.js.hbs')
    if (fs.existsSync(ICE_JS_TEMPLATE)) {
        const content = fs.readFileSync(ICE_JS_TEMPLATE).toString()
        let methodsObj = {}
        const paramArr = [, , , , , , [[7]], [[7]], , , ]
        if(fileData instanceof Array){
            for (let index = 0; index < fileData.length; index++) {
                const element = fileData[index];
                methodsObj[element] =  paramArr
            }
        }
        const result = handlebars.compile(content)({
            methodsObj:JSON.stringify(methodsObj,null,'\t')
        })
        fs.writeFileSync(ICE_JS_PATH, result);
        iceBusinessJSPath = ICE_JS_PATH
    }
}
// 渲染client.js 模板
const renderClientJS = (clientPath,filename) => {
    const fileData = fs.readFileSync(clientPath).toString();
    const CLIENT_TEMPLATE = path.resolve(__dirname, 'template/Client.js.hbs')
    compile({
        methodsArr: fileData
    }, clientPath,filename, CLIENT_TEMPLATE)
}
// 处理读取到的ice文件内容
const fileDealFunc = (fileContent) => {
    let newFileContentArr = []
    newFileContentArr = fileContent.split('void')
    let strArr = []
    for (let index = 1; index < newFileContentArr.length; index++) {
        const element = newFileContentArr[index]
        strArr.push(`${element.substring(1, element.indexOf('('))}`)
    }
    strArr = JSON.stringify(strArr, null, '\t')
    return strArr
}
// 编译client.js
/**
 * @param {Object}  meta-数据定义
 * @param {String}  filePath-目标文件路径
 * @param {String}  templatePath-模板文件路径
 * @return {void}
 */
const compile = (meta, filePath,filename, templatePath) => {
    const templateName = splitPath(templatePath);
    filename = filename.split('.')[0]
    let FILEPATH = filePath.replace(filename, templateName)
    FILEPATH = FILEPATH.replace('.json', '.js')
    if (fs.existsSync(templatePath)) {
        const content = fs.readFileSync(templatePath).toString()
        const result = handlebars.compile(content)(meta)
        fs.writeFileSync(FILEPATH, result);
        clientJSPath = FILEPATH;
    }
}
// 分割路径
splitPath = (path) => {
    const a =path.indexOf('.js') == -1? path.split('.json')[0]:path.split('.js')[0];
    const b = a.indexOf("/") !== -1 ? a.split('/') : a.split("\\");
    const c = b[b.length - 1];
    return c
}


module.exports = {
    parseFile
}