export default {
    /*
        TODO
            
            text 属性是新增的 ✔
            
            动态组件 name

            rects 中原有的属性，新增时需要计算 例如宽高..

            移除功能

            预设 class 例如： box-shaddow

            Tip 回显

            

    */ 
    'rects': [
        {
            'width': 200,
            'height': 150,
            'top': 10,
            'left': 10,
            'draggable': true,
            'resizable': true,
            'minw': 10,
            'minh': 10,
            'axis': 'both',
            'parentLim': true,
            'snapToGrid': false,
            'aspectRatio': false,
            'zIndex': 1,
            'color': '#EF9A9A',
            'active': false,
            'text': '我是标题 1'
        },
        {
            'width': 200,
            'height': 150,
            'top': 170,
            'left': 220,
            'draggable': true,
            'resizable': true,
            'minw': 10,
            'minh': 10,
            'axis': 'both',
            'parentLim': true,
            'snapToGrid': false,
            'aspectRatio': false,
            'zIndex': 1,
            'color': '#E6C27A',
            'active': false,
            'class': 'box-shaddow',
            'text': '我是标题 2'
        },
        {
            'width': 200,
            'height': 150,
            'top': 10,
            'left': 220,
            'draggable': true,
            'resizable': true,
            'minw': 10,
            'minh': 10,
            'axis': 'both',
            'parentLim': true,
            'snapToGrid': false,
            'aspectRatio': false,
            'zIndex': 2,
            'color': '#AED581',
            'active': false,
            'text': '我是标题 3'
        },
        {
            'width': 200,
            'height': 150,
            'top': 170,
            'left': 10,
            'draggable': true,
            'resizable': true,
            'minw': 10,
            'minh': 10,
            'axis': 'both',
            'parentLim': true,
            'snapToGrid': false,
            'aspectRatio': false,
            'zIndex': 3,
            'color': '#81D4FA',
            'active': false,
            'text': '我是标题 4'
        }
    ]
};
