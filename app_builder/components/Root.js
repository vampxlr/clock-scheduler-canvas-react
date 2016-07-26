import React , { Component } from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import actions from '../redux/action'
import {radiansToDegrees,pixelToDegree,degreesToRadians} from '../utils/pieGeometry'


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
        this.counter=0;
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
                this.drawSegmentWithAngleColorValue(canvas, context,selectedPieState[key].startingAngle,selectedPieState[key].angleValue,selectedPieState[key].color)
            }
        }
    }

    addPieToReduxStateWithAngle(startingAngle,angleValue){
        this.props.actions.pie_local_addPieToState(startingAngle-(angleValue/2),angleValue,randomColor(),"pie","AM")

    }





    componentDidMount(){

        //this.initializeCircle()
        setTimeout(()=>{

            this.drawPiesWithPieState(this.props.pieState)
            log(this.props.pieState)

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
        var x = e.nativeEvent.offsetX;
        var y = e.nativeEvent.offsetY;

        this.addPieToReduxStateWithAngle(Math.round(pixelToDegree(x,y)),30)
        setTimeout(()=>{

            this.drawPiesWithPieState(this.props.pieState)

        }, 10);

    }

    handleDragEnd(e){
        var x = e.nativeEvent.offsetX;
        var y = e.nativeEvent.offsetY;

        //console.log("end angle")
        //console.log(Math.round(pixelToDegree(x,y)))
        var angle = Math.round(pixelToDegree(x,y))
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


        //console.log(this.counter)
        if(this.counter==1)
        {

            this.props.actions.selection_local_selectPieObjectByAngle(Math.round(pixelToDegree(x,y)))
            log("x: "+x)
            log("y: "+y)
            log("counter: "+this.counter)
            log(e.nativeEvent)

        }
        if(this.counter>1 )
        {

            this.props.actions.selection_local_updateSelectedPiesAngleByAngle(pixelToDegree(x,y))
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

        log( pixelToDegree(x,y))
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawSegment(canvas, ctx, 0);
        this.drawSegmentWithLocation(canvas,ctx,pixelToDegree(x,y)-15)
    }
    render(){
        return(
            <div id="Root" >


                <canvas draggable="true" id="myCan" height="500" width="500" onDrag={this.handleDrag.bind(this)} onClick={this.handleClick.bind(this)} onDragEnd={this.handleDragEnd.bind(this)} onDragStart={this.handleDragStart.bind(this)}>

                </canvas>

                <button id="delete_all_btn" onClick={this.handleDeleteAll.bind(this)}>Delete All</button>
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