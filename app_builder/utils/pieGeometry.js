

exports.radiansToDegrees=function(rad) {
    return (rad / Math.PI)*180;
}


exports.degreesToRadians=function(degrees) {
    return (degrees * Math.PI)/180;
}
exports.pixelToDegree=function(x,y,centerX=250,centerY=250){

    var delY = y - centerY
    var delX = x - centerX
    var quardant = 1;

    var gradient = delY/delX
    var radSlope = Math.atan(gradient)
    var  degrees = exports.radiansToDegrees(radSlope)
    if(delY>0 && delX>0)
    {
        quardant = 1
    }

    if(delY>0 && delX<0)
    {
        quardant = 2
        return degrees + 180
    }
    if(delY<=0 && delX<0)
    {
        quardant = 3
        return degrees + 180
    }
    if(delY<0 && delX>0)
    {
        quardant = 4
        return 360 + degrees
    }



  /*  console.log(degrees)
    console.log(quardant)*/
    return degrees

}

