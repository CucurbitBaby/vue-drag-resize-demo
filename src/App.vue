<template>
  <div id="app">
    <div class="list" id="list">
      <div style="position: absolute; left: 10px; top: 400px;">activeRect: {{ activeRect }}</div>
      <template v-for="(rect, index) in rects">
          <!-- 
            :isDraggable="rect.draggable" 
            
          -->
        <VueDragResize
          v-if="rect.isShow"
          :key="index"
          :w="rect.width"
          :h="rect.height"
          :x="rect.left"
          :y="rect.top"
          :axis="rect.axis"
          :isActive="rect.active"
          :parentW="listWidth"
          :parentH="listHeight"
          :minw="rect.minw"
          :minh="rect.minh"
          :isDraggable="rect.draggable"
          :isResizable="rect.resizable"
          :parentLimitation="rect.parentLim"
          :snapToGrid="rect.snapToGrid"
          :aspectRatio="rect.aspectRatio"
          :z="rect.zIndex"
          :contentClass="rect.class"
          v-on:activated="activateEv(index)"
          v-on:deactivated="deactivateEv(index)"
          v-on:dragging="changePosition($event, index)"
          v-on:dragstop="dragStop($event, index)"
          v-on:resizing="changeSize($event, index)"
          v-on:resizestop="resizestop($event, index)"
          v-on:clicked="clickHandle"
        >
        <!-- :preventActiveBehavior="preventActiveBehavior" -->

          <!-- <textbar :index="index" /> -->
          <!-- <div class="filler" :style="{ backgroundColor: rect.color }">
            <h1>
                text: {{ rect.text }} <br /><br />
                z-index: {{ rect.zIndex }}<br /><br />
                left: {{ rect.left }}, top: {{ rect.top }}<br /><br />
                width: {{ rect.width }}, height: {{ rect.height }}<br /><br />
              </h1>
           
          </div> -->
          <!-- <div v-if="rect.showHtml" class="test-class" v-html="rect.text" :style="{ backgroundColor: rect.color }"></div> -->
          <div v-show="showHTML(rect, index)" class="test-class" v-html="rect.text" :style="{ backgroundColor: rect.color }"></div>

        </VueDragResize>
      </template>


      <!-- 
        width: tinyMceObject.width+'px',
        height: tinyMceObject.height+'px', 
          'z-index': 10,
      -->
      <div
        v-show="showTinyMCE"
        class="test"
        :style="{
          position: 'absolute',
          width: tinyMceObject.width+'px',
          height: tinyMceObject.height+'px',
          left: tinyMceObject.left+'px',
          top: tinyMceObject.top+'px',
          'z-index': 1,
          'background-color': '#ccc',
          'border-radius': '8px',
        }"
        @click="_stopPropagation($event)"
      >
        <!-- :width="'200px'" :height="'150px'"  -->
        <tinymce 
          v-show="showTinyMCE" 
          :value="editorStr"
          :width="tinyMceObject.width" 
          :height="tinyMceObject.height"
          @input="handleChangeEditValue"
          @click="changePointE" />
      </div>

    </div>

    <bullet></bullet>
  </div>
</template>

<script>
// import VueDragResize from '../components/vue-drag-resize.vue';
import VueDragResize from "vue-drag-resize";
import bullet from "@/components/bullet/bullet.vue";
import textbar from '@/components/textbar'
// import Editor from "@tinymce/tinymce-vue";
import Tinymce from '@/components/Tinymce'

import "./icons";

function dotProduct(pointA, pointB, pointE) {
  return (
    (pointB.x - pointA.x) * (pointE.x - pointA.x) +
    (pointB.y - pointA.y) * (pointE.y - pointA.y)
  );
}

function isPointInFourPoints(pointE, pointA, pointB, pointC, pointD) {
  let AB = dotProduct(pointA, pointB, pointE);
  let BC = dotProduct(pointB, pointC, pointE);
  let CD = dotProduct(pointC, pointD, pointE);
  let DA = dotProduct(pointD, pointA, pointE);
  return AB >= 0 && BC >= 0 && CD >= 0 && DA >= 0;
}

export default {
  name: "app",
  components: {
    VueDragResize,
    bullet,
    textbar,
    // editor: Editor,
    Tinymce
  },
  data() {
    return {
      listWidth: 0,
      listHeight: 0,

      tinyMceObject: {
        position: 'absolute',
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      showTinyMCE: false,

      editorStr: '',
      editorStrCopy: '',
      pointE: {
        x: 0,
        y: 0
      },

      beforeDragLeft: 0,
      beforeDragTop: 0,

      preventActiveBehavior: false
    };
  },
  mounted() {
    let listEl = document.getElementById("list");
    this.listWidth = listEl.clientWidth;
    this.listHeight = listEl.clientHeight;
    window.addEventListener("resize", () => {
      this.listWidth = listEl.clientWidth;
      this.listHeight = listEl.clientHeight;
    });
  },
  computed: {
    rects() {
      return this.$store.state.rect.rects;
    },
    activeRect() {
      return this.$store.getters["rect/getActive"];
    },
    // preventActiveBehavior() {
    //   return !this.rects.some(element => element.active)
    // }
  },
  methods: {
    // TODO 有可能命中Element  主动激活可以解决双text的bug
    // TODO TinyMCE  聚焦的时候不可以 resize? || 禁用隐藏 resize
    clickHandle(e) {
      // if (e.target.nodeName === "INPUT" || e.target.nodeName === "TEXTAREA") {
      //   e.target.focus();
      // }
      this.changePointE(e)
    },

    changePointE(e) {


      // console.group('this.activeRect')
      // console.log(this.activeRect)
      // console.groupEnd()


      // console.group('坐标')
      // console.log('x', e.x)
      // console.log('y', e.y)
      // console.groupEnd()

      this.pointE.x = e.x
      this.pointE.y = e.y
    },

    // 激活元素
    activatingElement(e) {

    },

    showHTML(element, id) {
      const pointA = { x: element.left, y: element.top }
      const pointB = { x: element.left + element.width, y: element.top }
      const pointC = { x: element.left + element.width, y: element.top + element.height }
      const pointD = { x: element.left, y: element.top + element.height }

      if(isPointInFourPoints(this.pointE, pointA, pointB, pointC, pointD)) {
        this.$store.dispatch("rect/setActive", { id });
        return false
      }

      return !element.active
    },

    setTinySizePosition(obj) {
      this.tinyMceObject.width = obj.width - 20;
      this.tinyMceObject.height = obj.height - 20;
      this.tinyMceObject.left = obj.left + 10;
      this.tinyMceObject.top = obj.top + 10;
    },

    // 点击拖拽元素激活事件
    activateEv(index) {
      console.group('激活')
      console.groupEnd()

      const { left, top } = this.rects[index]
      this.beforeDragLeft = left
      this.beforeDragTop = top


      this.$store.dispatch("rect/setActive", { id: index });
      
      this.setTinySizePosition(this.rects[index])

   
      this.showTinyMCE = true
      this.editorStr = this.rects[index].text
    },

    // 点击其他，激活元素的失去激活事件
    deactivateEv(index) {
      console.group('失焦')
      console.groupEnd()

      // 未设置的活动
      this.$store.dispatch("rect/unsetActive", { id: index });
    },

    // 每当拖动组件时调用
    changePosition(newRect, index) {

      this.$store.dispatch("rect/setTop", { id: index, top: newRect.top });
      this.$store.dispatch("rect/setLeft", { id: index, left: newRect.left });
      this.$store.dispatch("rect/setWidth", {
        id: index,
        width: newRect.width,
      });
      this.$store.dispatch("rect/setHeight", {
        id: index,
        height: newRect.height,
      });
      
      this.showTinyMCE = false
    },

    dragStop(newRect, index) {

      //  tip 同步 tinyMCE
      this.setTinySizePosition(newRect)

      const xx = newRect.left - this.beforeDragLeft
      const yy = newRect.top - this.beforeDragTop

      this.pointE.x = this.pointE.x + xx
      this.pointE.y = this.pointE.y + yy


      this.showTinyMCE = true
    },

    // 每当组件调整大小时调用
    changeSize(newRect, index) {
      console.group('resize')
      console.groupEnd()

      this.$store.dispatch("rect/setTop", { id: index, top: newRect.top });
      this.$store.dispatch("rect/setLeft", { id: index, left: newRect.left });
      this.$store.dispatch("rect/setWidth", {
        id: index,
        width: newRect.width,
      });
      this.$store.dispatch("rect/setHeight", {
        id: index,
        height: newRect.height,
      });

      // tip 同步 tinyMCE 宽高
      this.setTinySizePosition(newRect)
    },

    // 每当组件调整大小时调用
    resizestop(newRect, index) {
      
    },

    handleChangeEditValue(val) {
      this.editorStrCopy = val
      

      if (this.activeRect !== null) {
        this.$store.dispatch("rect/chnageText", { id: this.activeRect, text: val });
      }
    },
    _stopPropagation(ev) {
      var _this = this;
      ev.stopPropagation();
    },
  },
};
</script>


<style>
body {
  height: 100vh;
  width: 100vw;
  background-color: #ececec;
}
#app {
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  font-family: "Lato", sans-serif;
}
.filler {
  width: 100%;
  height: 100%;
  display: inline-block;
  position: absolute;
}
.list {
  position: absolute;
  top: 30px;
  bottom: 30px;
  left: 30px;
  right: 300px;
  box-shadow: 0 0 2px #aaa;
  background-color: white;
}
.box-shaddow {
  box-shadow: 10px 10px 15px 0px rgba(125, 125, 125, 1);
}



.tinymce-container,
.tinymce-textarea {
  height: 100%;
} 

/* 
.vdr-stick {
  z-index: 2;
  width: 12px!important;
  height: 12px!important; 
}
*/

/* 
.hide-resize-points .vdr-stick {
  display: none;
} 
*/

.test-class {
  word-break: break-word;
}
</style>