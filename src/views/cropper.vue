<template>
    <div>
    <div>
        <div>
            <input v-if="inputShow" type="file" id="change" accept="image" @change="change">
        </div>
    </div>
     <el-dialog :id="dialogId" append-to-body @open="dialogOpen"  @close="diaglogClose" style="line-height: 0;text-align:left" class="ui-dialog-min" title="裁剪" :visible.sync="panel" :close-on-click-modal='false'>
                <el-row>
                    <el-col :span="24">
                        <div class="avatar-wrapper">
                            <img :id="picId" :src="url" alt="Picture">
                        </div>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn-1" @click="panel=false">取 消</el-button>
                    <el-button class="btn-2" @click="crop" type="primary">确 定</el-button>
                </div>
            </el-dialog>
    </div>        
</template>
<script>
import Cropper from 'cropperjs'
export default {
    props: ['aspectRatio', 'data', 'uploadUrl', 'extensions', 'maxFileSize'],
    data() {
        return {
            picValue: '',
            picId:'image',
            dialogId: 'dialogId',
            cropper: '',
            croppable: false,
            panel: false,
            inputShow: true,
            url: '',
            cropArgs: {
                toCropImgH: '',
                toCropImgW: '',
                toCropImgX: '',
                toCropImgY: ''
            }
        }
    },
    mounted() {
        this.picId='image'+Math.random();
        this.dialogId='dialogId'+Math.random();

    },
    methods: {
        getObjectURL(file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        },
        change(e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            var self = this;
            this.picValue = files[0];
            if (this.extensions != "" && this.extensions != undefined) {
                let extensionsArr = this.extensions.split(',');
                let matchType = 0;
                for (let i = 0; i < extensionsArr.length; i++) {
                    if (this.picValue.type.indexOf(extensionsArr[i]) > -1) {
                        matchType++;
                    }
                }
                if (matchType == 0) {
                    e.target.value = '';
                    self.$emit("imageuploadedError", "只允许上传" + this.extensions);
                    return;
                }
            }
            if (this.maxFileSize != "" && this.maxFileSize != undefined) {
                if (this.picValue.size > this.maxFileSize) {
                     e.target.value = '';
                    self.$emit("imageuploadedError", "只允许上传小于" + this.maxFileSize / 1024 / 1024 + 'M' + '的图片');
                    return;
                }

            }
            this.panel = true;
            this.url = this.getObjectURL(this.picValue);
            this.inputShow = false;

            // //每次替换图片要重新得到新的url


        },
        crop() {
            this.panel = false;
            var croppedCanvas;
            //var roundedCanvas;

            if (!this.croppable) {
                return;
            }
            // Crop
            croppedCanvas = this.cropper.getCroppedCanvas();
            // Round
            // roundedCanvas = this.getRoundedCanvas(croppedCanvas);

            this.picValue = this.dataURItoBlob(croppedCanvas.toDataURL());
            this.cropArgs = {
                toCropImgH: parseInt(this.cropper.getData().height),
                toCropImgW: parseInt(this.cropper.getData().width),
                toCropImgX: parseInt(this.cropper.getData().x),
                toCropImgY: parseInt(this.cropper.getData().y)
            }
            //console.log(this.cropArgs);
            this.postImg()

        },
        dataURItoBlob(dataURI) {//图片转成Buffer
    
             var byteString = atob(dataURI.split(',')[1]);
             var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
             var ab = new ArrayBuffer(byteString.length);
             var ia = new Uint8Array(ab);
             for (var i = 0; i < byteString.length; i++) {
                 ia[i] = byteString.charCodeAt(i);
             }
             return new Blob([ab], {type: mimeString});
        },
        getRoundedCanvas(sourceCanvas) {

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var width = sourceCanvas.width;
            var height = sourceCanvas.height;

            canvas.width = width;
            canvas.height = height;

            context.imageSmoothingEnabled = true;
            context.drawImage(sourceCanvas, 0, 0, width, height);
            context.globalCompositeOperation = 'destination-in';
            context.beginPath();
            context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
            context.fill();

            return canvas;
        },
        postImg() {
            //这边写图片的上传
            let self = this;
            var formData = new FormData();
            formData.append('files', this.picValue); // 文件数据
            var xmlobj = new XMLHttpRequest();
            //指定提交类型和选择要发送的地址
            xmlobj.open('post', this.uploadUrl);
            //发送数据
            xmlobj.send(formData);
            xmlobj.onload = function() {
                self.inputShow = true;
                self.$emit("imageuploaded", JSON.parse(xmlobj.responseText))

            }
        },
        diaglogClose() {
            this.inputShow = true;
            var dialog = document.getElementById(this.dialogId);
            document.body.removeChild(dialog);

        },
        dialogOpen(){
            let self = this;
            if (!this.cropper) {
                this.$nextTick(function() {
                    var image = document.getElementById(this.picId);
                    this.cropper = new Cropper(image, {
                        aspectRatio: self.aspectRatio,
                        viewMode: 1,
                        background: false,
                        zoomable: true,
                        ready: function() {
                            self.croppable = true;
                        }
                    });

                })
            } else {
                this.cropper.replace(this.url);

            }
        }
    }
}
</script>
<style>
* {
    margin: 0;
    padding: 0;
}
/*!
 * Cropper.js v1.0.0-rc
 * https://github.com/fengyuanchen/cropperjs
 *
 * Copyright (c) 2017 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2017-03-25T12:02:21.062Z
 */

.cropper-container {
    font-size: 0;
    line-height: 0;

    position: relative;

    -webkit-user-select: none;

    -moz-user-select: none;

    -ms-user-select: none;

    user-select: none;

    direction: ltr;
    -ms-touch-action: none;
    touch-action: none
}

.cropper-container img {
    /* Avoid margin top issue (Occur only when margin-top <= -height) */
    display: block;
    min-width: 0 !important;
    max-width: none !important;
    min-height: 0 !important;
    max-height: none !important;
    width: 100%;
    height: 100%;
    image-orientation: 0deg
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.cropper-wrap-box {
    overflow: hidden;
}

.cropper-drag-box {
    opacity: 0;
    background-color: #fff;
}

.cropper-modal {
    opacity: .5;
    background-color: #000;
}

.cropper-view-box {
    display: block;
    overflow: hidden;

    width: 100%;
    height: 100%;

    outline: 1px solid #39f;
    outline-color: rgba(51, 153, 255, 0.75);
}

.cropper-dashed {
    position: absolute;

    display: block;

    opacity: .5;
    border: 0 dashed #eee
}

.cropper-dashed.dashed-h {
    top: 33.33333%;
    left: 0;
    width: 100%;
    height: 33.33333%;
    border-top-width: 1px;
    border-bottom-width: 1px
}

.cropper-dashed.dashed-v {
    top: 0;
    left: 33.33333%;
    width: 33.33333%;
    height: 100%;
    border-right-width: 1px;
    border-left-width: 1px
}

.cropper-center {
    position: absolute;
    top: 50%;
    left: 50%;

    display: block;

    width: 0;
    height: 0;

    opacity: .75
}

.cropper-center:before,
.cropper-center:after {
    position: absolute;
    display: block;
    content: ' ';
    background-color: #eee
}

.cropper-center:before {
    top: 0;
    left: -3px;
    width: 7px;
    height: 1px
}

.cropper-center:after {
    top: -3px;
    left: 0;
    width: 1px;
    height: 7px
}

.cropper-face,
.cropper-line,
.cropper-point {
    position: absolute;

    display: block;

    width: 100%;
    height: 100%;

    opacity: .1;
}

.cropper-face {
    top: 0;
    left: 0;

    background-color: #fff;
}

.cropper-line {
    background-color: #39f
}

.cropper-line.line-e {
    top: 0;
    right: -3px;
    width: 5px;
    cursor: e-resize
}

.cropper-line.line-n {
    top: -3px;
    left: 0;
    height: 5px;
    cursor: n-resize
}

.cropper-line.line-w {
    top: 0;
    left: -3px;
    width: 5px;
    cursor: w-resize
}

.cropper-line.line-s {
    bottom: -3px;
    left: 0;
    height: 5px;
    cursor: s-resize
}

.cropper-point {
    width: 5px;
    height: 5px;

    opacity: .75;
    background-color: #39f
}

.cropper-point.point-e {
    top: 50%;
    right: -3px;
    margin-top: -3px;
    cursor: e-resize
}

.cropper-point.point-n {
    top: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize
}

.cropper-point.point-w {
    top: 50%;
    left: -3px;
    margin-top: -3px;
    cursor: w-resize
}

.cropper-point.point-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: s-resize
}

.cropper-point.point-ne {
    top: -3px;
    right: -3px;
    cursor: ne-resize
}

.cropper-point.point-nw {
    top: -3px;
    left: -3px;
    cursor: nw-resize
}

.cropper-point.point-sw {
    bottom: -3px;
    left: -3px;
    cursor: sw-resize
}

.cropper-point.point-se {
    right: -3px;
    bottom: -3px;
    width: 20px;
    height: 20px;
    cursor: se-resize;
    opacity: 1
}

@media (min-width: 768px) {

    .cropper-point.point-se {
        width: 15px;
        height: 15px
    }
}

@media (min-width: 992px) {

    .cropper-point.point-se {
        width: 10px;
        height: 10px
    }
}

@media (min-width: 1200px) {

    .cropper-point.point-se {
        width: 5px;
        height: 5px;
        opacity: .75
    }
}

.cropper-point.point-se:before {
    position: absolute;
    right: -50%;
    bottom: -50%;
    display: block;
    width: 200%;
    height: 200%;
    content: ' ';
    opacity: 0;
    background-color: #39f
}

.cropper-invisible {
    opacity: 0;
}

.cropper-bg {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}

.cropper-hide {
    position: absolute;

    display: block;

    width: 0;
    height: 0;
}

.cropper-hidden {
    display: none !important;
}

.cropper-move {
    cursor: move;
}

.cropper-crop {
    cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
    cursor: not-allowed;
}

#change {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    filter: alpha(opacity=0);
}

.avatar-wrapper {
    height: 364px;
    width: 100%;
    margin-top: 15px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, .25);
    background-color: #fcfcfc;
    overflow: hidden;
}

.avatar-wrapper img {
    height: auto;
    max-width: 100%;
}

.cropper-container {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
}
</style>