export default (Vue) => {
    Vue.directive("drag", {
      
      inserted: function (el) { 
        let oDiv = el   // 获取当前元素
        oDiv.onmousedown = (e) => { 
          // 算出鼠标相对元素的位置
          let disX = e.clientX - oDiv.offsetLeft
          let disY = e.clientY - oDiv.offsetTop
          document.onmousemove = (e) => {
            // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX
            let top = e.clientY - disY
            if(left<0){
              left=0;
            }
            oDiv.style.left = left + 'px'
            oDiv.style.top = top + 'px'
            console.log(oDiv.style.left+"*"+oDiv.style.top);
          }
          document.onmouseup = (e) => {
          document.onmousemove = null
          document.onmouseup = null
          }
        }
      }
    })
  }
   