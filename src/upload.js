const {
  ipcRenderer
} = require('electron')
let filename = '';
let path = '';
// 上传按钮
$('#upload-file-btn').on('click', function () {
  creatInputFile()
})
// 开始解析
$('#parse-file-btn').on('click', function () {
  startParseIceFile()
})
function creatInputFile() {
  let input = $(`<input type="file" accept='.ice'/>`)
  
  $(input).on('change', function (e) {
    let files = e.target.files || [];
    path = files[0].path;
    filename = files[0].name;
    if (!path || !filename) {
      alert('请选择上传文件')
    }
    $('.upload-filename').html(filename)
   
  })
  input.click();
}
function startParseIceFile() {
  if (!filename || !path) {
    alert('请选择上传文件')
    return
  }
  ipcRenderer.send("uploadFile", {
    path,
    filename
  })
}
// 前端监听后台Node进程发过来的消息：
ipcRenderer.on('uploadFileSuccess', (event, arg) => {
  const {
    code,
    msg
  } = arg;
  if (code === 0) {
    alert('解析文件成功')
  } else {
    alert('解析文件失败,请重试')
  }
});