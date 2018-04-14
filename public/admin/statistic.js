/**
 * Created by 1111 on 17.01.2016.
 * В этом файле содержатся функции для сохранения решенных примеров и просмотра
 * сохранения. Его метод push будет вызываться из test.html Exerc в тот момент, когда производится проверка
 */
statistic = {};
//List of all exercises, answers and time of execute
// for example {"time":c,"str":"18 : 3 = 6","right":true}
statistic.table = [];

//array with a information of the days, hours, executes
//for example
// {days:"01.02",
// interval:[0,19],
// hours:[
//  {hour:12,
//  interval:[0,9],
//  exec:[
//      {time:1453125007020,
//      interval[0,4]}]}
//  {...}]}
statistic.map = [];

//Добавление нового примера м массив статистики и его сохранение в
//localStorage
statistic.push = function(value,right){
    var eid = save.location.EID;
    var uid = save.location.UID;
    var time = new Date();
    time = time.getTime();
    var el = {
        time  : time,
        str   : value,
        right : right,
        eid   : eid,
        uid   : uid
    };

    statistic.table.push(el);
    save.statUpload(el)
};

//Чтение статистики из localStorage и inspire array map
statistic.parse = function(){
    //variables of the build counts array map
    var dayCounter = 0, hourCounter = 0, exeCounter = 0;
    var time = new Date(), hoursTime = new Date();
    var dayFlag = true, hourFlag = true, exercFlag = true;

    for(var i = 0;i < statistic.table.length;i ++) {
        time.setTime(statistic.table[i].time);
        var days = time.toLocaleDateString();
        var hours = time.getHours();
        var fTime = new Date(), hTime = new Date();
        if (typeof statistic.table[i + 1] != "undefined") {
            fTime.setTime(statistic.table[i + 1].time);
            var fDays = fTime.toLocaleDateString();
            var fHours = fTime.getHours()
        } else {
            fTime = false;
            fDays = false;
            fHours = false;
        }
        if (typeof statistic.table[i - 1] != "undefined") {
            hTime.setTime(statistic.table[i - 1].time);
            var hDays = hTime.toLocaleDateString();
            var hHours = hTime.getHours();
        } else {
            hTime = false;
            hDays = false;
            hHours = false;
        }
        //Stack of the write this object
        //begin to new day
        if (days != hDays && dayFlag || !hDays && !fDays) {
            statistic.map[dayCounter] = {
                day: days,
                interval: [i],
                hours: []
            };
            console.log("New day");
        }
        //begin to new hour
        if ((+hoursTime + 1000 * 60 * 60 <= time || hourCounter == 0) && hourFlag) {
            statistic.map[dayCounter].hours[hourCounter] = {
                hour: hours,
                interval: [i],
                exerc: []
            };
            hoursTime.setTime(statistic.table[i].time);
            hourFlag = false;
            console.log(i + " " + dayCounter + " " + hourCounter);
        }
        //begin to new exec
        if ((+hTime + 2000 <= time || !hTime) && exercFlag) {
            console.log("Begin Exercise");
            exercFlag = false;
            var exercTime = new Date();
            exercTime.setTime(statistic.table[i].time);
            statistic.map[dayCounter].hours[hourCounter].exerc[exeCounter] = {
                time:exercTime,
                interval:[i]
            };
        }
        //end of exec
        if ((+time + 2000 < fTime || !fTime) && !exercFlag) {
            console.log("end exe");
            exercFlag = true;
            statistic.map[dayCounter].hours[hourCounter].exerc[exeCounter].interval[1] = i;
            exeCounter++;
        }
        //end of the hour
        if ((+hoursTime + 1000 * 60 * 60 < fTime || !fTime) && !hourFlag) {
            statistic.map[dayCounter].hours[hourCounter].interval[1] = i;
            hourFlag = true;
            exeCounter = 0;
            hourCounter++;
            console.log("hour close")
        }
        //end of the day
        if (days != fDays) {
            statistic.map[dayCounter].interval[1] = i;
            hourCounter = 0;
            dayFlag = true;
            dayCounter++;
        }
    }
};

//Составление меню для выбора дат и часов из статистики
statistic.catalog = function(element,writeStatElem){
    if(statistic.map.length == 0){
        writeStatElem.innerHTML = "<h1>Статистика еще не собиралась" +
            " или была удалена. Пора это исправить!";
        return;
    }
    var ul = document.createElement("ul");
    var counter = 0;
    for(var i = 0;i < statistic.map.length;i ++){
        var li = document.createElement("li");
        li.innerHTML = "<span>"+statistic.map[i].day+"</span>";
        li.childNodes[0].day = i;
        var ul2 = document.createElement("ul");
        counter ++;
        for(var j = 0;j < statistic.map[i].hours.length; j++){
            var li2 = document.createElement("li");
            li2.innerHTML = statistic.map[i].hours[j].hour + " часов";
            li2.day = i;
            li2.hour = j;
            ul2.appendChild(li2);
            counter ++;
        }
        li.appendChild(ul2);
        ul.appendChild(li);
    }
    ul.size = counter;
    ul.addEventListener("click",function(event){
        var th = event.target;
        //Заглушка вызова функции write statistic
        statistic.write(th.day,th.hour,writeStatElem);
    });
    element.appendChild(ul);

    var lastDay = statistic.map.length - 1;
    var lastHour = statistic.map[lastDay].hours.length - 1;
    statistic.write(lastDay,lastHour,writeStatElem)
};

//Вывод на экран заданной статистики
statistic.write = function(day,hour,element){
    element.innerHTML = "";//Очищает элемент для чистого вывода. При отладке недопустимо.
    var header = document.createElement("h1");
    header.innerHTML = "Статистика";
    element.appendChild(header);
    if(typeof hour != "undefined")
        writeHour(day,hour);
    else {
        for(var i = 0;i < statistic.map[day].hours.length; i ++)
        {
            writeHour(day,i);
        }
    }

    //Внутренняя функция вывода на экран часа
    function writeHour(day,hour){
        var exerc = statistic.map[day].hours[hour].exerc;

        for(var i = 0;i < exerc.length;i ++){
            var field = document.createElement("fieldset");
            var legend = document.createElement("legend");
            legend.innerHTML = exerc[i].time.toLocaleString();
            field.appendChild(legend);
            var start = exerc[i].interval[0];
            var stop = exerc[i].interval[1];
            var score = 0;
            console.log("new exerc");
            while(start <= stop){
                console.log(statistic.table[start]);
                var statStr = document.createElement("a");
                statStr.href="test.html?UID=" + save.location.UID + "&EID=" + statistic.table[start].eid;
                var right = JSON.parse(statistic.table[start].right);
                var color = (right)? "#0F0":"#F00";
                if(right) score ++;
                statStr.innerHTML = statistic.table[start].str;
                statStr.style.color = color;
                field.appendChild(statStr);
                var br = document.createElement("br");
                field.appendChild(br)
                start ++
            }
            var hr = document.createElement("hr");
            var text = document.createTextNode("Правильных ответов: " + score);
            field.appendChild(hr);
            field.appendChild(text);
            element.appendChild(field);
        }
    }
};