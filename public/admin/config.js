//Вывод на страницу test.html инструментов редактирования системных переменных
var config = {};
config.edit = function()
{
    main.win ="conf";
    var printZone = document.getElementById("exercisions");
    printZone.innerHTML = "";
    var i = 0;
    for (var counter in config.conf) {
        if(!config.conf.hasOwnProperty(counter)) continue;
        if(counter == "_id" || counter == "directs") continue;

        config.list[i] = document.createElement("div");
        config.list[i].id = counter;
        var inList = config.conf[counter];

        //Создание переменной типа type в процессе исследования inList на набор параметров (утинная типизация)
        var type;
        if(typeof(inList.args) == "undefined" && typeof(inList.value) == "number"    && typeof(inList.type) == "string" ) {
            type = 0;
        }
        if(typeof(inList.args) == "undefined" && typeof(inList.value) == "undefined" && typeof(inList.type) == "undefined" ) {
            type =  1;
        }
        if(typeof(inList.args) == "object"    && typeof(inList.value) == "number"    && typeof(inList.type) == "string" ) {
            type =  2;
        }
        if(inList.hidden) {
            type =  3;
        }

        //Офйормление и вывод элементов
        if (type == 0) {
            config.list[i].innerHTML = '<input type="text" size="3" maxlength="6" value="'+ inList.value +'"/><span>'+ inList.type +'</span>';
        } else if(type == 1) {
            config.list[i].innerHTML = "<h1>" + inList.header + "</h1>";
        } else if(type == 2) {
            var selector = document.createElement("select");
            var length = inList.args.length;
            var options = "";
            for (var j = 0; j < length; j++) {
                var selected = (inList.value == j)? " selected='selected' " : "";
                options += "<option" + selected + ">" + inList.args[j] + "</option>";
            }
            selector.innerHTML = options;
            config.list[i].appendChild(selector);
            var description = document.createElement("span"); description.innerHTML = inList.type;
            config.list[i].appendChild(description);

        } else if (type == 3) {
            config.list[i].style.display = 'none';
        }
        printZone.appendChild(config.list[i]);
        i ++;
    }
    main.popup.configsave();
    main.keyboard.init();
};

//Сохранение переменных в объект
config.save = function()
{

    var counter = config.list.length;
    for (var i = 0; i < counter; i++) {
        var input  = config.list[i].getElementsByTagName("input" )[0];
        var select = config.list[i].getElementsByTagName("select")[0];
        var id = config.list[i].id;
        if (input) {
            config.conf[id].value = parseFloat(input.value);
        } else if (select) {
            config.conf[id].value = select.selectedIndex;
        }
        delete config.conf._id
    }

    init.start();
    main.output();
};

//Набор для редактирования настроек главного меню
config.mainMenu = {};

//Переменная флаг указывает режим редактирования
config.mainMenu.flag = false;

// список удаляемых пунктов меню
config.mainMenu.editList = [];

//Включение графического режима редактирования меню
config.mainMenu.edit = function(){
    if(config.mainMenu.flag) {
        return;
    }
    config.mainMenu.flag = true;
    // Изменение кнопки "редактировать меню" для сохранения изменений 
    var doButton = document.getElementById("corrector");
    doButton.innerHTML = "Принять изменения";
    //Заглушка функции синхронного удаления
    doButton.onclick = config.mainMenu.accept;

    var collectButton = document.querySelectorAll("#toolbar ul li");
    for(var i = 0; i < collectButton.length; i++) {
        //alert(collectButton[i].childNodes[0].id)
        if(collectButton[i].childNodes[0].id.length == 0 || collectButton[i].childNodes[0].id == "corrector" ){
            continue;
        }
        var closer = document.createElement("span");
        closer.innerHTML = "удалить";
        closer.class = "closers";
        closer.onclick = config.mainMenu.delItem;
        //closer.
        collectButton[i].appendChild(closer);
    }
};

config.mainMenu.delItem = function(event) {
    var target = event.target.parentNode.querySelector("a");
    //Функция удаления отключена. Удаление будет запускаться синхронно отдельной командой
    //Здесь будет осуществляться запись в массив на удаление
    //save.lsGroups.del("menu",target.id);
    config.mainMenu.editList[config.mainMenu.editList.length] = target.id;
    target.onclick = false;
    target.style.color = "#dddddd";
    target.href = "#"
    event.target.onclick = false;
    event.target.style.color = "#dddddd"
};