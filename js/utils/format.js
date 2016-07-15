/*! ***************************************************************************
 *
 * evolutility :: format.js
 *
 * Helpers for string manipulation and date formats
 *
 * https://github.com/evoluteur/evolutility
 * Copyright (c) 2016 Olivier Giulieri
 *
 *************************************************************************** */

import React from 'react'

function notUndefined(v){
    return (typeof(v) != "undefined")
}

module.exports = {

    fieldValue(f, d){
        var v
        if(f.type==='boolean'){
            v = d ? <i className="glyphicon glyphicon-ok"></i> : ''
        }else if(f.type==='date'){
            v=this.dateString(d)
        }else if(f.type==='image'){
            v = this.image('http://localhost:8080/'+d)
        }else{
            v = d
        }
        return v
    },

    image(d){
        if(d===null){
            return null
        }
        return <img src={d} className="img-thumbnail" />
    },

    // --- date formats ---
    dateString: function(d){
        if(d){
            d=d.substring(0, 10);
        }
        if(notUndefined(d) && d!==null){
            var dateParts=d.split('-');
            if(dateParts.length>1){
                return dateParts[1]+'/'+dateParts[2]+'/'+dateParts[0];
            }
        }
        return '';
    },
    timeString: function(d){
        if(notUndefined(d) && d!==null && d!==''){
            var timeParts=d.split(':'),
                hour=parseInt(timeParts[0],10);
            if(hour>12){
                return (hour-12)+':'+timeParts[1]+' PM';
            }else{
                return hour+':'+timeParts[1]+' AM';
            }
        }
        return '';
    },
    datetimeString: function(d){
        if(notUndefined(d) && d!==null && d!==''){
            var dateParts=d.split('T');
            if(dateParts.length>1){
                return this.dateString(dateParts[0])+', '+this.timeString(dateParts[1]);
            }else{
                return this.dateString(dateParts[0]);
            }
        }
        return '';
    }

};