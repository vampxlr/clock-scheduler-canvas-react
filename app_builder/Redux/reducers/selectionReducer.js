import {saveLocal,getLocal} from '../../utils/webStorage'

function getId(pies) {
    return pies.reduce((maxId,pie)=>{
            return Math.max(pie.id,maxId)
        },-1)+1
}

function filterId(obj){
    return obj.id;
}

function into360(angle){

    while(angle>359){
        angle = angle-360
    }
return angle
}

export default function selectionReducer(selectionState=[],action){
    let new_selectionState = [...selectionState];
    let new_pieState
    switch(action.type){


        case'SELECTION_LOCAL_SELECT_PIE_OBJECT_BY_ID':
            new_pieState= getLocal("pieState")
            return new_pieState.filter(function(v) {
                return v.id === action.id;
            });

        case'SELECTION_LOCAL_SELECT_PIE_OBJECT_BY_ANGLE':
            new_pieState= getLocal("pieState")


            return new_pieState.filter(function(v) {

                var angleValue;
                var startingAngle;
                if(v.angleValue>=0){
                    angleValue = v.angleValue
                }else {
                    angleValue = v.angleValue + 360
                }
                if(v.startingAngle>=0){
                    startingAngle = v.startingAngle
                }else{
                    startingAngle = v.startingAngle +360
                }

                return startingAngle <= ((((startingAngle+angleValue)>360) && (startingAngle>action.angle))? parseInt(action.angle+360):action.angle) && ((startingAngle+angleValue) >= ((((startingAngle+angleValue)>360) && (startingAngle>action.angle))? parseInt(action.angle+360):action.angle));




            });

        case'SELECTION_LOCAL_UPDATE_SELECTED_PIES_ANGLE_BY_ANGLE':
            new_pieState= new_selectionState


            new_pieState= new_pieState.map(pie=>{
                return pie.id === pie.id ?
                    Object.assign({}, pie,{startingAngle: (pie.angleValue>=0)? action.angle-(pie.angleValue/2) : action.angle-((pie.angleValue+360)/2) }):
                    pie
            })

            return new_pieState

        case'SELECTION_LOCAL_UPDATE_ALL_SELECTED_PIES':
                    new_pieState= new_selectionState


             new_pieState = new_pieState.map(function(obj){
                obj.startingAngle = action.startingAngle;
                obj.angleValue = action.angleValue;
                obj.color = (action.color=="black")?obj.color:action.color;
                obj.className = action.className;
                return obj;
            });

                    return new_pieState



        default:
            // console.log("in login")
            return new_selectionState
    }
}