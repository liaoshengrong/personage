import { InputProp, fetcher } from '@/server/fetch';
import { preload } from 'swr'
// 定义一个预加载函数
export function preloadMount(list) {
  const images = [];
  // writeToGirlList(list)
  for (let i = 0; i < list?.length; i++) {
    images[i] = new Image();
    images[i].src = list?.[i]?.url;

    images[i].onload = function () {
      console.log("onload", "onload");

      if (i === list?.length) {
        // 所有图片加载完成，可以进入下一个页面了
        console.log("all images loaded");
      }
    };

    images[i].onerror = function (err) {
      console.log(err, i, "err");
    };
  }
}
// 数组去重
export function unique(data, uniqueField) {
  let uniqueArr = data.filter((item, index) => {
    return (
      data.findIndex((obj) => obj[uniqueField] === item[uniqueField]) === index
    );
  });
  return uniqueArr;
}


export function preloadFetch(url, inputData: InputProp) {
  console.log('preload:预请求');

  preload(url, (url) => fetcher(url, inputData))
}