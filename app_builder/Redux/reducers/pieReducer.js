import {saveLocal,getLocal} from '../../utils/webStorage'

function getId(pies) {
    return pies.reduce((maxId,pie)=>{
            return Math.max(pie.id,maxId)
        },-1)+1
}

function filterId(obj){
    return obj.id;
}

export default function pieReducer(pieState=[],action){
    let new_pieState = [...pieState];
    switch(action.type){

        case'PIE_LOCAL_GET_PIE_STATE':
            new_pieState= getLocal("pieState")
           // console.log("getLocal")
           // console.log(getLocal("pieState"))
            return new_pieState;

        case'PIE_LOCAL_GET_PIE_OBJECT_BY_ID':
            new_pieState= getLocal("pieState")
            return new_pieState.filter(function(v) {
                return v.id === action.id;
            });

        case'PIE_LOCAL_ADD_PIE_TO_STATE':
          //  console.log("inside add pie state")
            let startingAngle=action.startingAngle
            let angleValue=action.angleValue
            let color = action.color
            let className=action.className
            let amOrPm=action.amOrPm



            if(startingAngle!=undefined){
              // console.log("in add pie");


                new_pieState =[ {
                    id:getId(new_pieState),
                    startingAngle:startingAngle,
                    angleValue:angleValue,
                    color:color,
                    className:className,
                    amOrPm:amOrPm
                }
                    , ...new_pieState
                    ]
                }

                saveLocal("pieState",new_pieState)
            //console.log("getLocal")
           // console.log(getLocal("pieState"))
            return new_pieState;


        case'PIE_LOCAL_UPDATE_PIE_FROM_STATE':



            for(var key in new_pieState){
                if(new_pieState[key].id == action.id)
                {
                    new_pieState[key].startingAngle=action.startingAngle
                    new_pieState[key].angleValue= action.angleValue
                    new_pieState[key].color= action.color
                    new_pieState[key].className = action.className
                    new_pieState[key].amOrPm = action.amOrPm
                }

            }




            saveLocal("pieState",new_pieState)
            return new_pieState


        case'PIE_LOCAL_DELETE_PIE_FROM_STATE':
            let pie;
            pie = new_pieState[action.id];
            new_pieState = new_pieState.filter(pie=>{
                return pie.id !== action.id
            })




            saveLocal("pieState",new_pieState)
            return new_pieState



        case'PIE_LOCAL_DELETE_ALL_PIE_FROM_STATE':


            new_pieState = [];



            saveLocal("pieState",new_pieState)
            return new_pieState


        default:
            // console.log("in login")
            return pieState
    }
}