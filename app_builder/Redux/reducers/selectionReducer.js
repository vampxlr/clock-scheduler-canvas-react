import {saveLocal,getLocal} from '../../utils/webStorage'

function getId(pies) {
    return pies.reduce((maxId,pie)=>{
            return Math.max(pie.id,maxId)
        },-1)+1
}

function filterId(obj){
    return obj.id;
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
                return v.startingAngle <= action.angle && (v.startingAngle+v.angleValue) >= action.angle;
            });

        case'SELECTION_LOCAL_UPDATE_SELECTED_PIES_ANGLE_BY_ANGLE':
            new_pieState= new_selectionState


            new_pieState= new_pieState.map(pie=>{
                return pie.id === pie.id ?
                    Object.assign({}, pie,{startingAngle: action.angle-(pie.angleValue/2)}):
                    pie
            })

            return new_pieState

        case'SELECTION_LOCAL_UPDATE_ALL_SELECTED_PIES':
                    new_pieState= new_selectionState


             new_pieState = new_pieState.map(function(obj){
                obj.startingAngle = action.startingAngle;
                obj.angleValue = action.angleValue;
                obj.color = action.color;
                obj.className = action.className;
                return obj;
            });

                    return new_pieState



        default:
            // console.log("in login")
            return new_selectionState
    }
}