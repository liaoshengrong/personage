看到这个标题，可能会想：不就是 `html2canvas` 吗？  
No,复杂的 html 结构可没这么简单  
这个也叫 html 的快照

## 简单的 html 转 png

```js
import html2canvas from "html2canvas";
html2canvas(ref.current).then((canvas) => {
  const img = canvas.toDataURL("image/png");
  console.log(img); // base64 url
});
```

## 带图片的 html 转 png

```js
import html2canvas from 'html2canvas'
// 你有几张图？？ 得等它们挂载完才行
 // 等待所有图片加载完成
const images = ref.current!.getElementsByTagName('img');
const imagePromises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve; // 处理加载失败的情况
    });
});
Promise.all(imagePromises).then(() => {
    html2canvas(ref.current,{
        useCORS: true, // 允许跨域加载图片
        scale: 2, // 提高图片质量
        backgroundColor: null,
        onclone: (document, element) => {
          const modifys = element.getElementsByClassName('modify-offset');
          Array.from(modifys).forEach((item) => {
            item.classList.add('-translate-y-1');  // 转出来的文本整体会偏下的
          });
        },
    }).then((canvas) => {
      const img = canvas.toDataURL('image/png');
      console.log(img); // base64 url
    })
})
```

## html 转 pdf

```js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

html2canvas(ele)
  .then((canvas: any) => {
    console.log("end html2canvas");

    const imgData = canvas.toDataURL("image/png");
    console.log("start pdf");

    const pdf = new jsPDF("p", "mm", "a4");
    console.log("end jspdf");
    const a4Width = 210; // A4 width in mm
    const a4Height = 297; // A4 height in mm
    const canvasRatio = canvas.width / canvas.height;
    const pageRatio = a4Width / a4Height;
    let imgWidth, imgHeight;
    if (canvasRatio > pageRatio) {
      // 如果画布宽高比大于A4纸张的宽高比，则宽度填满页面
      imgWidth = a4Width;
      imgHeight = a4Width / canvasRatio;
    } else {
      // 否则高度填满页面
      imgHeight = a4Height;
      imgWidth = a4Height * canvasRatio;
    }

    pdf.addImage(
      imgData,
      "PNG",
      (a4Width - imgWidth) / 2,
      (a4Height - imgHeight) / 2,
      imgWidth,
      imgHeight
    );
    // pdf.save(data.productName);
    // 直接保存PDF文件
    // 将pdf转为url，并下载
    // 将pdf转为blob，并生成下载链接
    try {
      console.log("start download");

      const blob = pdf.output("blob");
      console.log(blob, "blobblob");

      const url = URL.createObjectURL(blob);

      console.log(url, "Safari");

      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.pdf`;

      // 模拟点击下载
      document.body.appendChild(a); // 在某些浏览器中可能需要将a标签添加到DOM中
      a.click();
      console.log();
      console.log(url, "Safari222");

      // 清理
      document.body.removeChild(a);

      console.log("end download", "start revokeObjectURL");

      URL.revokeObjectURL(url); // 释放之前创建的object URL
      console.log("end revokeObjectURL");
    } catch (error) {
      console.log(error, "errorerror");
    }
  })
  .catch((error: any) => {
    console.log(error, "errorerror html2canvas");
  });
```
