import React , { Component } from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import actions from '../redux/action'
import {radiansToDegrees,pixelToDegree,degreesToRadians} from '../utils/pieGeometry'
import Root_Nav from './root_nav'
var top
var left

function into360(angle){

    while(angle>359 || angle<0){
        if(angle>359){
            angle = angle-360
        }

        if( angle<0){
            angle = angle+360
        }

    }
    return angle
}

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

function ClockOrAnti(angle1=10,angle2=20){


    function getAngleDIff(angle1,angle2){
        a = angle1 - angle2
        a = (a + 180) % 360 - 180
        return a
    }


}


function randomColor(){
    var allowed = "ABCDEF0123456789", S = "#";

    while(S.length < 7){
        S += allowed.charAt(Math.floor((Math.random()*16)+1));
    }
    return S;
}



class Root extends Component {

    getAngleDiff(angle1,angle2){
    var a = angle1 - angle2
        a = (a + 180) % 360 - 180
    return a
    }


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

        //context.restore();

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

        //context.restore();

    }


    drawSegmentWithAngleColorValueXY(canvas, context,startingAngleDeg=0,angleValue=360,color="#733EE3",x,y) {

        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        var circleCenterX = Math.floor(canvas.width / 2);
        var circleCenterY = Math.floor(canvas.width / 2);
        var radius = Math.floor(canvas.width / 2);

        var distancePC = Math.sqrt( (x-circleCenterX)*(x-circleCenterX) + (y-circleCenterY)*(y-circleCenterY) );
        var alpha = Math.abs(1- radius/(distancePC*0.9))
        var delX = x - this.touchFirst.x
        var delY = y - this.touchFirst.y

        var gradient = delY/delX
        var c = y - gradient*x

         var y2 = gradient*x +c

        centerX = centerX+ delX
        centerY =  centerY+ delY



        var midAngle = into360((startingAngleDeg + angleValue/2))

        //ilog("mid Angle into 360: " + (360-midAngle) )
        if(distancePC<150/2){
            distancePC=0
        }
        if(distancePC>150/2){
            distancePC=distancePC-(150/2)
        }
        var yCord = distancePC * Math.sin(degreesToRadians(midAngle))
        var xCord = distancePC * Math.cos(degreesToRadians(midAngle))

        //ilog("xCord: " + xCord )
        //ilog("yCord: " + yCord )

        //ilog(alpha)
        var startingAngle = degreesToRadians(startingAngleDeg);
        var arcSize = degreesToRadians(angleValue);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(xCord+125, yCord+125);
        context.arc(xCord+125, yCord+125, radius,
            startingAngle, endingAngle, false);
        context.closePath();
        //alpha =1
        context.fillStyle = 'rgba(255, 0, 0, '+alpha+')';
        context.fill();


        // Draw the path that is going to be clipped





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

        //context.restore();

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
        this.touchOperationStatus="neutral";
        this.singleTouchTimeCounter=0;
        this.singleTouchTimeCounterSetInterval=function(){};
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

    drawPiesWithPieState(pieStateOriginal,selectedPieState){
        var canvas = document.getElementById('myCan');

        var context = (canvas.getContext) ?
            canvas.getContext('2d') : null;
        var pieState = [...pieStateOriginal]
        pieState= pieState.reverse()
        context.beginPath();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save()

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
        context.restore();
    }


    drawPiesWithPieStateForDelete(pieStateOriginal,selectedPieState,x,y){
        var canvas = document.getElementById('myCan');

        var context = (canvas.getContext) ?
            canvas.getContext('2d') : null;
        var pieState = [...pieStateOriginal]
        pieState= pieState.reverse()
        //context.restore()
        //context.clear()

        context.clearRect(0, 0, canvas.width, canvas.height);


        this.drawSegmentWithAngleColorValue(canvas, context)


        for(var key in pieState)
        {
            this.drawSegmentWithAngleColorValue(canvas, context,pieState[key].startingAngle,pieState[key].angleValue,pieState[key].color)
        }

        if(selectedPieState){
            for(var key in selectedPieState)
            {
                //context.restore()
             /*   context.beginPath();
                context.moveTo(canvas.width/2, canvas.height/2);
                context.arc(canvas.width/2, canvas.height/2, canvas.height/2,
                    0, 2*Math.PI, false);


                context.clip();*/

                //this.drawSegmentWithAngleColorValue(canvas, context,selectedPieState[key].startingAngle,selectedPieState[key].angleValue,selectedPieState[key].color)
                this.drawSegmentWithAngleColorValueXY(canvas, context,selectedPieState[key].startingAngle,selectedPieState[key].angleValue,"grey",x,y)

            }
        }
        context.restore();
    }


    addPieToReduxStateWithAngle(startingAngle,angleValue){
        this.props.actions.pie_local_addPieToState("s","s",startingAngle-(angleValue/2),angleValue,randomColor(),"pie","AM")

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

            top = element.getBoundingClientRect().top  - element.ownerDocument.documentElement.clientTop
            left = element.getBoundingClientRect().left  - element.ownerDocument.documentElement.clientLeft
            ilog(top)
            ilog(left)

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

            this.props.actions.selection_local_selectPieObjectByAngle(Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2)))

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


        var event = e.nativeEvent
        var x = parseInt(e.targetTouches[0].pageX - left - 1);
        var y = parseInt(e.targetTouches[0].pageY - top - 1);

        if(this.touchCounter==1)
        {


            if(this.touchOperationStatus=="neutral"){
                this.singleTouchTimeCounterSetInterval = setInterval(()=>{

                    if(this.touchOperationStatus=="neutral" && this.singleTouchTimeCounter >1){
                        this.touchOperationStatus="delete"
                        this.props.actions.selection_local_selectPieObjectByAngle(Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2)))
                        var except = this.subtractArrayById(this.props.pieState,this.props.selectionState)

                        this.drawPiesWithPieState(except,this.props.selectionState)
                    }


                    this.singleTouchTimeCounter= this.singleTouchTimeCounter+1

                }, 500);
            }

            /*if(this.singleTouchTimeCounter>4 && this.touchOperationStatus=="neutral"){
                this.touchOperationStatus="delete"
            }*/
            this.props.actions.selection_local_selectPieObjectByAngle(Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2)))
            this.touchFirst.x = x
            this.touchFirst.y = y


                setTimeout(function(){

                    this.touchFirst.pieStartingAngle= (this.props.selectionState.length>0)? this.props.selectionState[0].startingAngle:0
                    this.touchFirst.pieClosingAngle=this.touchFirst.pieStartingAngle + ( (this.props.selectionState.length>0)?this.props.selectionState[0].angleValue:0 )
                    this.touchFirst.identifier= event.targetTouches[event.targetTouches.length-1].identifier
                    this.touchFirst.angle=Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2))
                    this.touchFirst.startAngle=Math.round(pixelToDegree(x,y,this.canvasWidth/2,this.canvasHeight/2))


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


        }




    }

    handleTouchMove(e){



        e.preventDefault()

        if(e.nativeEvent.changedTouches.length==1 && this.touchCounter==2 && e.nativeEvent.changedTouches[0].identifier == this.touchSecond.identifier && (this.touchOperationStatus=="neutral"||this.touchOperationStatus=="resize")){
/*
            ilog("in resize")
*/
            clearInterval(this.singleTouchTimeCounterSetInterval);

            this.touchOperationStatus=="resize"
          /*  ilog("this.touchSecond.startAngle")
            ilog(this.touchSecond.startAngle)
            ilog("this.touchFirst.startAngle")
            ilog(this.touchFirst.startAngle)*/
            this.touchSecond.x  = parseInt(e.nativeEvent.changedTouches[0].pageX-left-1)
            this.touchSecond.y = parseInt(e.nativeEvent.changedTouches[0].pageY-top-1)
            this.touchSecond.angle = Math.round(pixelToDegree(this.touchSecond.x,this.touchSecond.y,this.canvasWidth/2,this.canvasHeight/2))
            var delAngle = this.touchSecond.angle - this.touchFirst.angle
            //var delStartAngle = this.touchSecond.startAngle - this.touchFirst.startAngle
            var delStartAngle = this.getAngleDiff(this.touchSecond.startAngle, this.touchFirst.startAngle)
            //var startingAngle = this.props.selectionState.length>0 ? this.props.selectionState[0].startingAngle:0;
            //var closingAngle = this.props.selectionState.length>0 ? this.props.selectionState[0].startingAngle+this.props.selectionState[0].angleValue:0;
            var delAngleClosingAndSecondTouch = this.touchFirst.pieClosingAngle-this.touchSecond.angle
            var delAngleStartingAndSecondTouch = this.touchSecond.angle - this.touchFirst.pieStartingAngle

           /* ilog(delStartAngle)*/
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

        var delAngleFirstTouchAngle1 = Math.abs(this.touchFirst.startAngle-angle1)

        if(!(delAngleFirstTouchAngle1>20||this.touchOperationStatus=='move')){


        }
        if(e.nativeEvent.changedTouches.length==1 && this.touchCounter==1 && e.nativeEvent.changedTouches[0].identifier == this.touchFirst.identifier && (this.touchOperationStatus=="neutral"||this.touchOperationStatus=="move") && (delAngleFirstTouchAngle1>20||this.touchOperationStatus=="move")  )
        {

            //ilog("inside move")
            this.touchOperationStatus="move"
            var selectedAngle = pixelToDegree(parseInt(e.targetTouches[0].pageX - left - 1),parseInt(e.targetTouches[0].pageY - top - 1),this.canvasWidth/2,this.canvasHeight/2)
            this.props.actions.selection_local_updateSelectedPiesAngleByAngle(selectedAngle)




            var except = this.subtractArrayById(this.props.pieState,this.props.selectionState)

            this.drawPiesWithPieState(except,this.props.selectionState)

        }


        if(e.nativeEvent.changedTouches.length==1 && this.touchCounter==1 && e.nativeEvent.changedTouches[0].identifier == this.touchFirst.identifier && (this.touchOperationStatus=="delete"))
        {

            var x1 = parseInt(e.targetTouches[0].pageX - left - 1);
            var y1 = parseInt(e.targetTouches[0].pageY - top - 1);
            var centerX = this.canvasWidth/2

            var centerY = this.canvasHeight/2

            var except = this.subtractArrayById(this.props.pieState,this.props.selectionState)

            this.drawPiesWithPieStateForDelete(except,this.props.selectionState,x1,y1)

            var distance = Math.sqrt( (x1-centerX)*(x1-centerX) + (y1-centerY)*(y1-centerY) );
            //ilog("distance:" + distance)
          if(distance>(this.canvasHeight/2*1.15)){

              var r = confirm("Delete The Selected Pie!");
              if (r == true) {


                  clearInterval(this.singleTouchTimeCounterSetInterval);
                  var selectionState = this.props.selectionState
                  for (var key in selectionState){
                      this.props.actions.pie_local_deletePieFromState(selectionState[key].id)
                  }
                  setTimeout(()=>{

                     this.drawPiesWithPieState(this.props.pieState)

                  }, 10);
                  this.handleTouchEnd(e)
              } else {


                  clearInterval(this.singleTouchTimeCounterSetInterval);
                  setTimeout(()=>{
                      this.drawPiesWithPieState(this.props.pieState)



                  }, 10);
                  this.handleTouchEnd(e)
              }

          }
        }




    }

    handleTouchEnd(e){
        clearInterval(this.singleTouchTimeCounterSetInterval);
        this.touchCounter=0;
        this.singleTouchTimeCounter=0;
        //ilog("Touch End")
        //ilog(this.touchCounter)


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

    handleClearLog(){
        var p = document.getElementById('log');
        p.innerHTML = "Log Cleared";
    }
    render(){
        return(
            <div id="Root" className="container">
                <Root_Nav reset_all={this.handleDeleteAll.bind(this)} clear_log={this.handleClearLog.bind(this)}/>


                <div className="row main_body" >
                    <div className="col-md-4 col-md-offset-2">
                        <div id="cellphoneFrame">
                            <div id="canvas_container">
                                <canvas id="canvas" onTouchCancel={this.handleTouchCancel.bind(this)} onTouchEnd={this.handleTouchEnd.bind(this)}  onTouchMove={this.handleTouchMove.bind(this)} onTouchStart={this.handleTouchStart.bind(this)} draggable="true" id="myCan" height="250" width="250" onDrag={this.handleDrag.bind(this)} onClick={this.handleClick.bind(this)} onDragEnd={this.handleDragEnd.bind(this)} onDragStart={this.handleDragStart.bind(this)}>
                                </canvas>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-4">
                        <div id="infoFrame">


                        </div>
                    </div>
                </div>

                <div className="row main_body" >
                    <footer ><pre id="log">sdsadsa</pre></footer>
                </div>





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