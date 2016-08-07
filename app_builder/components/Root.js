import React , { Component } from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import actions from '../redux/action'
import {radiansToDegrees,pixelToDegree,degreesToRadians} from '../utils/pieGeometry'

var top
var left

function ilog(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg + "\n" + p.innerHTML;
}
JSON.stringifyOnce = function(obj, replacer, indent){
    var printedObjects = [];
    var printedObjectKeys = [];

    function printOnceReplacer(key, value){
        if ( printedObjects.length > 2000){ // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
            return 'object too long';
        }
        var printedObjIndex = false;
        printedObjects.forEach(function(obj, index){
            if(obj===value){
                printedObjIndex = index;
            }
        });

        if ( key == ''){ //root element
            printedObjects.push(obj);
            printedObjectKeys.push("root");
            return value;
        }

        else if(printedObjIndex+"" != "false" && typeof(value)=="object"){
            if ( printedObjectKeys[printedObjIndex] == "root"){
                return "(pointer to root)";
            }else{
                return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase()  : typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
            }
        }else{

            var qualifiedKey = key || "(empty key)";
            printedObjects.push(value);
            printedObjectKeys.push(qualifiedKey);
            if(replacer){
                return replacer(key, value);
            }else{
                return value;
            }
        }
    }
    return JSON.stringify(obj, printOnceReplacer, indent);
};



function log(data){
    // console.log(data)
}

function sumTo(a, i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
        sum += a[j];
    }
    return sum;
}




function randomColor(){
    var allowed = "ABCDEF0123456789", S = "#";

    while(S.length < 7){
        S += allowed.charAt(Math.floor((Math.random()*16)+1));
    }
    return S;
}



class Root extends Component {



    subtractArrayById(pieStateAll,pieStateSelected){
        let pieStateAllExceptSelected = pieStateAll;
        for(var key in pieStateSelected){

            pieStateAllExceptSelected = pieStateAllExceptSelected.filter(function(v){
                return v.id != pieStateSelected[key].id
            })

        }
        return pieStateAllExceptSelected


    };


    drawSegment(canvas, context, i,data,colors) {
        context.save();
        var data = [360];
        var labels = ["360"];
        var colors = ["#733EE3"];
        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        var radius = Math.floor(canvas.width / 2);

        var startingAngle = degreesToRadians(sumTo(data, i));
        var arcSize = degreesToRadians(data[i]);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius,
            startingAngle, endingAngle, false);
        context.closePath();

        context.fillStyle = colors[i];
        context.fill();

        context.restore();

    }

    drawSegmentWithAngleColorValue(canvas, context,startingAngleDeg=0,angleValue=360,color="#733EE3") {

        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        var radius = Math.floor(canvas.width / 2);

        var startingAngle = degreesToRadians(startingAngleDeg);
        var arcSize = degreesToRadians(angleValue);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius,
            startingAngle, endingAngle, false);
        context.closePath();

        context.fillStyle = color;
        context.fill();

        context.restore();

    }

    drawSegmentWithLocation(canvas, context, degstartingAngle) {
        context.save();
        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        var radius = Math.floor(canvas.width / 2);

        var startingAngle = degreesToRadians(degstartingAngle);
        var arcSize = degreesToRadians(30);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius,
            startingAngle, endingAngle, false);
        context.closePath();

        context.fillStyle = "#fff";
        context.fill();

        context.restore();

        //drawSegmentLabel(canvas, context, i);
    }


    constructor(props, context) {
        super(props, context);

        this.canvasWidth=0;
        this.canvasHeight=0;
        this.counter=0;
        this.touchCounter=0;
        this.touchFirst={x:0,y:0,angle:0,identifier:0,pieStartingAngle:0,pieClosingAngle:0};
        this.touchSecond={x:0,y:0,angle:0,identifier:0};
        this.touchOperationStatus="neutral"
        this.state = {
            circle:[],
            styleSheetRef:[]
        };
    };

    initializeCircle() {

        var canvas = document.getElementById('myCan');

        var ctx = (canvas.getContext) ?
            canvas.getContext('2d') : null;





        if (ctx) {

            ctx.fillStyle = '#4A4464';
            ctx.lineWidth = 17;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#fff';



            var centerX = Math.floor(canvas.width / 2);
            var centerY = Math.floor(canvas.height / 2);
            log("centerX: " + centerX)
            log("centerY: " + centerY)




            var data = [360];
            var labels = ["360"];
            var colors = ["#733EE3"];





            for (var i = 0; i < data.length; i++) {
                this.drawSegment(canvas, ctx, i);
            }


            this.drawSegmentWithLocation(canvas,ctx,360)
        }


    }

    drawPiesWithPieState(pieState,selectedPieState){
        var canvas = document.getElementById('myCan');

        var context = (canvas.getContext) ?
            canvas.getContext('2d') : null;

        context.clearRect(0, 0, canvas.width, canvas.height);


        this.drawSegmentWithAngleColorValue(canvas, context)

        for(var key in pieState)
        {
            this.drawSegmentWithAngleColorValue(canvas, context,pieState[key].startingAngle,pieState[key].angleValue,pieState[key].color)
        }

        if(selectedPieState){
            for(var key in selectedPieState)
            {
                //this.drawSegmentWithAngleColorValue(canvas, context,selectedPieState[key].startingAngle,selectedPieState[key].angleValue,selectedPieState[key].color)
                this.drawSegmentWithAngleColorValue(canvas, context,selectedPieState[key].startingAngle,selectedPieState[key].angleValue,"grey")
            }
        }
    }

    addPieToReduxStateWithAngle(startingAngle,angleValue){
        this.props.actions.pie_local_addPieToState(startingAngle-(angleValue/2),angleValue,randomColor(),"pie","AM")

    }





    componentDidMount(){

        //var scrollPositionFromTop =(window.pageYOffset || document.scrollTop)  - (document.clientTop || 0);


        //scrollPositionFromTop = (scrollPositionFromTop==NaN)?0:scrollPositionFromTop
        //var scrollPositionFromleft =(window.pageXOffset || document.scrollLeft) - (document.clientLeft || 0);
        //scrollPositionFromleft = (scrollPositionFromleft==NaN)?0:scrollPositionFromleft
        var element = document.getElementById('myCan');
        this.canvasWidth=element.width;
        this.canvasHeight=element.height;



//        console.log(element.getBoundingClientRect())
        //this.initializeCircle()
        setTimeout(()=>{

            this.drawPiesWithPieState(this.props.pieState)
            log(this.props.pieState)
            //ilog(window.pageYOffset || 0)
            //ilog(document.scrollTop || 0)
            //ilog(document.clientTop || 0)
            //var currentScrollYPosition = document.clientTop || 0
            //var currentScrollXPosition = document.clientLeft || 0
            top = element.getBoundingClientRect().top  - element.ownerDocument.documentElement.clientTop
            left = element.getBoundingClientRect().left  - element.ownerDocument.documentElement.clientLeft

            //ilog("element.getBoundingClientRect().top: " + element.getBoundingClientRect().top)
            //ilog("window.pageYOffset: " + window.pageYOffset)
            //ilog("element.ownerDocument.documentElement.clientTop: " + element.ownerDocument.documentElement.clientTop)
            //ilog("top: " + top)
            //ilog("left: " + left)
        }, 10);

        setTimeout(()=>{


        }, 1000);
    }
    componentWillMount() {
        this.props.actions.pie_local_getPieState()

    }
    componentDidUpdate(){

    }
    handleClick(e){
        //alert( JSON.stringifyOnce(e))
        var x = e.nativeEvent.offsetX;
        var y = e.nativeEvent.offsetY;
        console.log("x: "+x)
        console.log("y: "+y)
        this.addPieToReduxStateWithAngle(Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2)),30)
        setTimeout(()=>{

            this.drawPiesWithPieState(this.props.pieState)

        }, 10);

    }

    handleDragEnd(e){
        var x = e.nativeEvent.offsetX;
        var y = e.nativeEvent.offsetY;

        //console.log("end angle")
        //console.log(Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2)))
        var angle = Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2))
        this.counter = 0;
        var selectionState = this.props.selectionState
        for (var key in selectionState){
            this.props.actions.pie_local_updatePieFromState(selectionState[key].id,angle-14,selectionState[key].angleValue,selectionState[key].color,selectionState[key].className,selectionState[key].amOrPm)
        }

        setTimeout(()=>{

            this.drawPiesWithPieState(this.props.pieState)

        }, 10);
    }

    handleDrag(e){

        this.counter++
        var x = e.nativeEvent.offsetX;
        var y = e.nativeEvent.offsetY;

        //console.log(e.nativeEvent)
        var startingCoordinateY;
        //console.log(this.counter)
        if(this.counter==1)
        {
            console.log(e.nativeEvent)
            this.props.actions.selection_local_selectPieObjectByAngle(Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2)))
            console.log("x: "+x)
            console.log("y: "+y)
            log("counter: "+this.counter)
            log(e.nativeEvent)

        }
        if(this.counter>1 )
        {

            this.props.actions.selection_local_updateSelectedPiesAngleByAngle(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2))
            log("this.props.selectionState")
            log(this.props.selectionState)

            var except = this.subtractArrayById(this.props.pieState,this.props.selectionState)
            log("except")
            log(except)
            this.drawPiesWithPieState(except,this.props.selectionState)
            log("x: "+x)
            log("y: "+y)
            log("counter: "+this.counter)
            log(e.nativeEvent)

        }



    }

    handleDeleteAll(){
        this.props.actions.pie_local_deleteAllPieFromState();
        setTimeout(()=>{

            this.drawPiesWithPieState(this.props.pieState)
            log(this.props.pieState)

        }, 10);

    }


    handleDragStart(e){

        var img = document.createElement("img");
        //img.src = "http://kryogenix.org/images/hackergotchi-simpler.png";
        e.nativeEvent.dataTransfer.setDragImage(img, 0, 0);


    }

    handleMouseMove(e){

        var x = e.nativeEvent.offsetX;
        var y = e.nativeEvent.offsetY;
        var canvas = document.getElementById('myCan');

        var ctx = (canvas.getContext) ?
            canvas.getContext('2d') : null;
        log("x: "+x)
        log("y: "+y)

        log( pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2))
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawSegment(canvas, ctx, 0);
        this.drawSegmentWithLocation(canvas,ctx,pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2)-15)
    }
    handleTouchStart(e){
        this.touchCounter=this.touchCounter+1;
        //console.log(element.getBoundingClientRect())
        //console.log(e.nativeEvent)
        console.log(e.nativeEvent)
        //ilog("touch Start")

        //ilog(this.touchCounter)
        //e.preventDefault()
        //ilog("identifier: ")
        //ilog(e.targetTouches[e.targetTouches.length-1].identifier)
        var event = e.nativeEvent
        var x = parseInt(e.targetTouches[0].pageX - left - 1);
        var y = parseInt(e.targetTouches[0].pageY - top - 1);
        //ilog("x: "+x)
        //ilog("y: "+y)
        //ilog("angle: "+Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2)))
        if(this.touchCounter==1)
        {
            this.props.actions.selection_local_selectPieObjectByAngle(Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2)))
            this.touchFirst.x = x
            this.touchFirst.y = y
            //ilog("inside first touch")

                setTimeout(function(){
                    //ilog("set time out")
                    //ilog(JSON.stringifyOnce(this.props.selectionState))
                    //ilog(JSON.stringifyOnce(this.props.pieState))
                    //console.log(this.props.selectionState)
                    //console.log(this.props.pieState)

                    this.touchFirst.pieStartingAngle= (this.props.selectionState.length>0)? this.props.selectionState[0].startingAngle:0
                    this.touchFirst.pieClosingAngle=this.touchFirst.pieStartingAngle + ( (this.props.selectionState.length>0)?this.props.selectionState[0].angleValue:0 )
                    this.touchFirst.identifier= event.targetTouches[event.targetTouches.length-1].identifier
                    this.touchFirst.angle=Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2))
                    this.touchFirst.startAngle=Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2))
                    //ilog("-----this.touchFirst.startAngle----")
                    //ilog(this.touchFirst.startAngle)

                }.bind(this), 10)


        }
        if(this.touchCounter==2)
        {
             x = parseInt(e.targetTouches[e.targetTouches.length-1].pageX - left - 1);
             y = parseInt(e.targetTouches[e.targetTouches.length-1].pageY - top - 1);
            this.touchSecond.x = x
            this.touchSecond.y = y
            this.touchSecond.identifier= e.targetTouches[e.targetTouches.length-1].identifier
            this.touchSecond.angle=Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2))
            this.touchSecond.startAngle=Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2))
            //ilog("this.touchSecond.startAngle")
            //ilog(this.touchSecond.startAngle)

        }




    }

    handleTouchMove(e){
        console.log("top: "+ top +"left: "+ left)


        e.preventDefault()
        //console.log(e.nativeEvent)
        //ilog(parseInt(e.nativeEvent.changedTouches[0].pageX-left-1))
        //ilog(parseInt(e.nativeEvent.changedTouches[0].pageY-top-1))
        //ilog(e.nativeEvent.changedTouches.length)
        if(e.nativeEvent.changedTouches.length==1 && this.touchCounter==2 && e.nativeEvent.changedTouches[0].identifier == this.touchSecond.identifier && (this.touchOperationStatus=="neutral"||this.touchOperationStatus=="resize")){

            this.touchOperationStatus=="resize"

            this.touchSecond.x  = parseInt(e.nativeEvent.changedTouches[0].pageX-left-1)
            this.touchSecond.y = parseInt(e.nativeEvent.changedTouches[0].pageY-top-1)
            this.touchSecond.angle = Math.round(pixelToDegree(this.touchSecond.x,this.touchSecond.y,this.canvasWidth/2,this.canvasHeight/2))
            var delAngle = this.touchSecond.angle - this.touchFirst.angle
            var delStartAngle = this.touchSecond.startAngle - this.touchFirst.startAngle
            //var startingAngle = this.props.selectionState.length>0 ? this.props.selectionState[0].startingAngle:0;
            //var closingAngle = this.props.selectionState.length>0 ? this.props.selectionState[0].startingAngle+this.props.selectionState[0].angleValue:0;
            var delAngleClosingAndSecondTouch = this.touchFirst.pieClosingAngle-this.touchSecond.angle
            var delAngleStartingAndSecondTouch = this.touchSecond.angle - this.touchFirst.pieStartingAngle


            if(delStartAngle<0)
            {
                //this.props.actions.selection_local_updateAllSelectedPies(this.touchSecond.angle,Math.abs(delAngle),"white")
                this.props.actions.selection_local_updateAllSelectedPies(this.touchSecond.angle,(delAngleClosingAndSecondTouch))
            }
            else if (delStartAngle>0)
            {
                this.props.actions.selection_local_updateAllSelectedPies(this.touchFirst.pieStartingAngle,(delAngleStartingAndSecondTouch))
                //this.props.actions.selection_local_updateAllSelectedPies(startingAngle,Math.abs(delAngle),"white")

            }



            var except = this.subtractArrayById(this.props.pieState,this.props.selectionState)

            this.drawPiesWithPieState(except,this.props.selectionState)

            //ilog(delAngle)
        }


        var x1 = parseInt(e.targetTouches[0].pageX - left - 1);
        var y1 = parseInt(e.targetTouches[0].pageY - top - 1);
        var angle1 = pixelToDegree(x1,y1,this.canvasWidth/2,this.canvasHeight/2)
        //ilog(angle1)
        //ilog("x1:"+ x1)
        //ilog("y1:"+ y1)
        var delAngleFirstTouchAngle1 = Math.abs(this.touchFirst.startAngle-angle1)
        //ilog("changedTouches.length:")
        //ilog(e.nativeEvent.changedTouches.length)
        //ilog("touch Start bool: ")
        //ilog(e.nativeEvent.changedTouches[0].identifier == this.touchFirst.identifier)
     //   ilog("e.nativeEvent.changedTouches.length==1")
     //   ilog(e.nativeEvent.changedTouches.length==1)
     //   ilog("this.touchCounter==1")
     //   ilog(this.touchCounter==1)
     //   ilog("this.touchCounter==1")
     //   ilog("e.nativeEvent.changedTouches[0].identifier == this.touchFirst.identifier")
     //   ilog(e.nativeEvent.changedTouches[0].identifier == this.touchFirst.identifier)
     //   ilog("e.nativeEvent.changedTouches[0].identifier == this.touchFirst.identifier")
     //   ilog("(this.touchOperationStatus=='neutral'||this.touchOperationStatus=='move')")
     //   ilog((this.touchOperationStatus=="neutral"||this.touchOperationStatus=="move"))
     //   ilog("(this.touchOperationStatus=='neutral'||this.touchOperationStatus=='move')")
     //   ilog("(delAngleFirstTouchAngle1>20||this.touchOperationStatus=='move')")
     //   ilog((delAngleFirstTouchAngle1>20||this.touchOperationStatus=="move"))
     //   ilog("(delAngleFirstTouchAngle1>20||this.touchOperationStatus=='move')")
        if(!(delAngleFirstTouchAngle1>20||this.touchOperationStatus=='move')){
           /* ilog("false")
            ilog("angle1")
            ilog(angle1)
            ilog("angle1")
            ilog("delAngleFirstTouchAngle1")
            ilog(delAngleFirstTouchAngle1)
            ilog("delAngleFirstTouchAngle1")
            ilog("this.touchFirst.startAngle")
            ilog(this.touchFirst.startAngle)
            ilog("this.touchFirst.startAngle")
            ilog(this.touchOperationStatus)*/

        }
        if(e.nativeEvent.changedTouches.length==1 && this.touchCounter==1 && e.nativeEvent.changedTouches[0].identifier == this.touchFirst.identifier && (this.touchOperationStatus=="neutral"||this.touchOperationStatus=="move") && (delAngleFirstTouchAngle1>20||this.touchOperationStatus=="move")  )
        {
            //ilog("inside move")
            this.touchOperationStatus="move"
            var selectedAngle = pixelToDegree(parseInt(e.targetTouches[0].pageX - left - 1),parseInt(e.targetTouches[0].pageY - top - 1),this.canvasWidth/2,this.canvasHeight/2)
            this.props.actions.selection_local_updateSelectedPiesAngleByAngle(selectedAngle)


            //log("this.props.selectionState")
            //log(this.props.selectionState)

            var except = this.subtractArrayById(this.props.pieState,this.props.selectionState)
            //log("except")
            //log(except)
            this.drawPiesWithPieState(except,this.props.selectionState)
            //log("x: "+x)
            //log("y: "+y)
            //log("counter: "+this.counter)
            //log(e.nativeEvent)

        }







    }

    handleTouchEnd(e){
        this.touchCounter=this.touchCounter=0;
        //ilog("Touch End")
        //ilog(this.touchCounter)
        console.log(e.nativeEvent)

        var selectionState = this.props.selectionState
        for (var key in selectionState){
            this.props.actions.pie_local_updatePieFromState(selectionState[key].id,selectionState[key].startingAngle,selectionState[key].angleValue,selectionState[key].color,selectionState[key].className,selectionState[key].amOrPm)
        }
        this.touchOperationStatus = "neutral"
        setTimeout(()=>{

            this.drawPiesWithPieState(this.props.pieState)

        }, 10);

    }

    handleTouchCancel(){
        this.touchCounter=0;
        //ilog("Touch End")

    }
    render(){
        return(
            <div id="Root" >

                <div id="cellphoneFrame">
                    <canvas onTouchCancle={this.handleTouchCancel.bind(this)} onTouchEnd={this.handleTouchEnd.bind(this)}  onTouchMove={this.handleTouchMove.bind(this)} onTouchStart={this.handleTouchStart.bind(this)} draggable="true" id="myCan" height="250" width="250" onDrag={this.handleDrag.bind(this)} onClick={this.handleClick.bind(this)} onDragEnd={this.handleDragEnd.bind(this)} onDragStart={this.handleDragStart.bind(this)}>
                    </canvas>
                </div>
                <button id="delete_all_btn" onClick={this.handleDeleteAll.bind(this)}>Delete All</button>
                <footer ><pre id="log"></pre></footer>
            </div>
        )
    }

}

function mapStateToProps(state){
    return state
}

function mapDispatchToProps(dispatch)
{
    return{
        actions: bindActionCreators(actions,dispatch)
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Root)