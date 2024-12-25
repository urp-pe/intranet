var mitimeoutIntranet;
var mypets = null;
var sagscroller1 = null;
var sesionValida = true;
$(document).ready(function () {

    var countNewsToday = 0;
    var htmlNotif = "";
    while (document.getElementById("nowid" + countNewsToday) !== null) {
        var idpopup = document.getElementById("idPopup" + countNewsToday).innerHTML;
        var title = document.getElementById("popuptitle" + idpopup).innerHTML;

        htmlNotif = htmlNotif + '<a class="dropdown-item" href="#" onclick="maximizePopup(' + idpopup + ')">' + title + ' <div class="ripple-container"></div></a>';
        countNewsToday++;

    }
    if (countNewsToday > 0) {
        $(".notification").text("" + (countNewsToday));
        $(".notification").css("display", "");
        $("#menuNotification").append('<span class="dropdown-header" ><h5 class="mb-0">' + (countNewsToday === 1 ? 'Una notificación' : countNewsToday + '  notificaciones') + '</h5></span><div class="dropdown-divider"></div>');
        $("#menuNotification").append(htmlNotif);
    } else {
        $(".notification").css("display", "none");
        $("#menuNotification").html('<span class="dropdown-header" ><h5 class="mb-0">No hay notificaciones</h5></span>');
    }

    document.getElementById("spanfechahoy").innerHTML = "bienvenido, hoy es " + fechaHoy();
    cargarAccesosdirectos();

    if ($("#divRendimientoAcad").length > 0) {

        $("#checkRendimientoAcad").click(function () {
            if ($('#checkRendimientoAcad').prop('checked')) {
                saveconfig("rendAcad", "true");
                $("#divRendimientoAcad").fadeIn(1200, "linear", function () {
                    document.getElementById("divRendimientoAcad").style.display = "";
                });
            } else {
                saveconfig("rendAcad", "false");
                $("#divRendimientoAcad").fadeOut(800, "linear", function () {
                    document.getElementById("divRendimientoAcad").style.display = "none";
                });
            }
        });
        cargarCurvaAprendisaje();

    }
    if (document.getElementById("divhorario") != undefined) {
        $("#checkHorario").click(function () {
            if ($('#checkHorario').prop('checked')) {
                saveconfig("horario", "true");
                $("#divhorario").fadeIn(1200, "linear", function () {
                    document.getElementById("divhorario").style.display = "";
                });
            } else {
                saveconfig("horario", "false");
                $("#divhorario").fadeOut(800, "linear", function () {
                    document.getElementById("divhorario").style.display = "none";
                });
            }
        });
        cargarDataHorario('');
    }



});
$(function () {
    validarSesion();
    if (!sesionValida) {
        return;
    }
    var asunto = $("#asunto"),
            email = $("#correo"),
            mensaje = $("#mensaje"),
            allFields = $([]).add(asunto).add(email),
            tips = $(".validateTips");
    function updateTips(t) {
        tips
                .text(t)
                .addClass('ui-state-highlight');
        setTimeout(function () {
            tips.removeClass('ui-state-highlight', 1500);
        }, 500);
    }
    function checkLength(o, n, min, max) {
        if (o.val().length > max || o.val().length < min) {
            o.addClass('ui-state-error');
            updateTips("Longitud del campo " + n + " debe de estar entre " + min + " y " + max + ".");
            return false;
        } else {
            return true;
        }
    }
    function checkRegexp(o, regexp, n) {
        if (!(regexp.test(o.val()))) {
            o.addClass('ui-state-error');
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }
    $('#dialog_link').click(function () {
        $('#dialog-form').dialog('open');
    });
});

function cerrarSistema() {
    $.ajax({
        url: 'destroySession.jsp',
        async: false,
        success: function () {
            document.location.href = "login";
        }
    });
}
function salir() {
    window.close();
}

function cargarAccesosdirectos() {
    $.ajax({
        url: "serviciosAlumno.jsp",
        type: "POST",
        cache: false,
        success: function (g) {
            var div = document.getElementById("accesosDirectos");
            div.innerHTML = g;
        }
    });
}
function validarSesion() {
    $.ajax({
        url: "intranet/validarSesion.jsp",
        type: "POST",
        cache: false,
        dataType: "json",
        async: false,
        success: function (g) {
            if (!g.success) {
                sesionValida = false;
                $.ajax({
                    url: "intranet/cerrarSesion.jsp",
                    type: "POST",
                    cache: false,
                    success: function (g) {
                        /*var div = document.getElementById("divallcontainer");
                         div.innerHTML = g;*/
                        var timerInterval;
                        Swal.fire({
                            title: '¡Su sesión ha expirado!',
                            html: 'Por favor vuelva a loguearse.<br><br> se cerrará en <b></b> milliseconds.',
                            timer: 4000,
                            onBeforeOpen: function () {
                                Swal.showLoading();
                                timerInterval = setInterval(function () {
                                    Swal.getContent().querySelector('b').textContent = Swal.getTimerLeft();
                                }, 100);
                            },
                            onClose: function () {
                                clearInterval(timerInterval)
                                document.location.href = "login"
                            }
                        }).then(function (result) {
                            console.log('finish timer');
                            /*if (result.dismiss === Swal.DismissReason.timer) {
                             console.log('I was closed by the timer');
                             }*/

                        });
                    }
                });
            } else {
                sesionValida = true;
            }
        }
    });
}

function redireccionarApp(urlPost, cmodu_interno, nmodu_alto, titleapp, element) {
    validarSesion();
    if (!sesionValida) {
        return;
    }
    var ipclient = $("#ipclient").val();
    document.getElementById("divredpag").innerHTML = "";
    var div = document.getElementById("divredpag");
    div.style.display = "none";
    urlPost = urlPost == "#" ? "" : urlPost;

    var height = screen.availHeight - 40;
    var width = screen.availWidth - 10;
    if (urlPost == "") {
        return;
    }
    $.ajax({
        url: 'intranet/grabarAuditoria.jsp',
        type: "POST",
        jsonp: "callback",
        cache: false,
        dataType: "json",
        data: ({
            params: urlPost,
            ip: ipclient
        }),
        success: function (g) {
        }
    });
    if (urlPost.indexOf(".htm") != -1 || urlPost.indexOf(".html") != -1) {
        window.open(urlPost, 'windowurp', "alwaysRaised=yes,hotkeys=0,menubar=0,resizable,width=" + width + ",height=" + height + ",scrollbars,top=0,left=0");
    } else {
        if (cmodu_interno == "SI") {
            $("#titleapp").html(titleapp);
            var i = 1;
            while (document.getElementById("idoption" + i) !== null) {

                var itemOption = document.getElementById("idoption" + i);
                itemOption.classList.remove("active");
                i++;
            }
            //element.classList.remove("active");
            if (element !== null) {
                element.classList.add("active");
            }
            //-----minimize sidebar
            if (md.misc.sidebar_mini_active === true) {
                //$('body').removeClass('sidebar-mini');
                // md.misc.sidebar_mini_active = false;

                //$('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

            } else {

                //$('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar('destroy');

                setTimeout(function () {
                    $('body').addClass('sidebar-mini');

                    md.misc.sidebar_mini_active = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);

            //--------
            cargarPaginaInterna("intranet/frmredirpag2.jsp?param=" + urlPost + "&from=intranet", nmodu_alto);
        } else {
            $.ajax({
                url: 'intranet/frmredirpag.jsp',
                type: "POST",
                cache: false,
                dataType: "html",
                data: ({
                    param: urlPost,
                    from: 'intranet'
                }),
                success: function (g) {
                    div.innerHTML = g;
                    document.getElementById('theSubmitButton').click();
                }
            });
        }
    }
}
function cargarPaginaInterna(url, nmodu_alto) {
    validarSesion();
    if (!sesionValida)
        return;
    document.getElementById("div_servicios").style.display = "none";
    document.getElementById("ifContent").style.display = "";
    document.getElementById("ifContent").src = url;

    /*
    var iframepos = $("#ifContent").position();
    $('#ifContent').contents().find('html').on('mousemove', function (e) {
        var x = e.clientX + iframepos.left;
        var y = e.clientY + iframepos.top;
        console.log(x + " " + y);
    })*/
}

function onSubmitForm(form, url) {
    document.getElementById("divredpag").style.display = "none";
    var height = screen.availHeight - 40;
    var width = screen.availWidth - 10;
    form.setAttribute("action", url);
    //window.open('http://www.google.com.pe','ddd','');
    window.open('', form.target, "alwaysRaised=yes,hotkeys=0,menubar=0,resizable,width=" + width + ",height=" + height + ",scrollbars,top=0,left=0");
    mitimeoutIntranet = setInterval(function () {
        clearDiv();
    }, 1000);
    return true;
}
function clearDiv() {
    window.clearTimeout(mitimeoutIntranet);
    var div = document.getElementById("divredpag");
    div.innerHTML = "";
}
function showPopup(id, msg, ancho, alto, x, y, bloqueo, titulo) {

    swal({
        title: "<h4><b>" + titulo + "</b></h4>",
        //text: '<div style="text-align:right;padding:5px 0 5px 0;margin-bottom:5px;"><span onclick="cargarLogin()" style="border-width:1px;border-style:solid;margin:0px; padding:5px; border-color:#CCCCCC;cursor:pointer;">Cerrar</span> </div> <iframe src="redirect.jsp?u=//webapp.urp.edu.pe/sclv/?m=cambiarclave1" frameborder="0" width="100%" scrolling="no" height="470"></iframe>',
        html: msg,
        customClass: 'swal-wide',
        //type: 'warning',
        showCancelButton: false,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Cerrar',
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        buttons: {
            confirm: {
                className: 'btn btn-success'
            }
        }
    });

    document.getElementById("divallcontainer").style.display = "none";

}
function showChangePass() {
    var html = document.getElementById("divFrmLogin").innerHTML;
    document.getElementById("divFrmLogin").innerHTML = "";
    swal({
        title: "Cambio de primera clave",
        //text: '<div style="text-align:right;padding:5px 0 5px 0;margin-bottom:5px;"><span onclick="cargarLogin()" style="border-width:1px;border-style:solid;margin:0px; padding:5px; border-color:#CCCCCC;cursor:pointer;">Cerrar</span> </div> <iframe src="redirect.jsp?u=//webapp.urp.edu.pe/sclv/?m=cambiarclave1" frameborder="0" width="100%" scrolling="no" height="470"></iframe>',
        html: html,
        customClass: 'swal-wide',
        //type: 'warning',
        showCancelButton: false,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Cerrar',
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false
    });
    document.getElementById("divallcontainer").style.display = "none";
}

function maximizePopup(el) {

    /*var nodes= document.getElementById("popupcontent" + el).childNodes;
     for(var i=0;i<nodes.length;i++){
     alert(nodes[i].innerHTML);
     }*/


    var strtext = document.getElementById("popupcontent" + el).innerHTML;
    strtext = strtext.replace(/ferhlink/g, 'target="_blank" href');
    strtext = strtext.replace(/width/g, 'widthh');
    swal({
        title: document.getElementById("popuptitle" + el).innerHTML,
        //text: '<div style="text-align:right;padding:5px 0 5px 0;margin-bottom:5px;"><span onclick="cargarLogin()" style="border-width:1px;border-style:solid;margin:0px; padding:5px; border-color:#CCCCCC;cursor:pointer;">Cerrar</span> </div> <iframe src="redirect.jsp?u=//webapp.urp.edu.pe/sclv/?m=cambiarclave1" frameborder="0" width="100%" scrolling="no" height="470"></iframe>',
        html: strtext,
        customClass: 'swal-wide',
        //type: 'warning',
        showCancelButton: false,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Cerrar',
        buttonsStyling: false,
        showConfirmButton: false,
        showCloseButton: true,
        width: '88%',
        height: '97%',
        left: '5%',
        buttons: {
            confirm: {
                className: 'btn btn-success'
            }
        }
    });
}
function maximizePopupImportant(el) {

    /*var nodes= document.getElementById("popupcontent" + el).childNodes;
     for(var i=0;i<nodes.length;i++){
     alert(nodes[i].innerHTML);
     }*/


    var strtext = document.getElementById("popupcontentII" + el).innerHTML;
    strtext = strtext.replace(/ferhlink/g, 'target="_blank" href');
    strtext = strtext.replace(/width/g, 'widthh');
    swal({
        title: document.getElementById("popuptitleII" + el).innerHTML,
        //text: '<div style="text-align:right;padding:5px 0 5px 0;margin-bottom:5px;"><span onclick="cargarLogin()" style="border-width:1px;border-style:solid;margin:0px; padding:5px; border-color:#CCCCCC;cursor:pointer;">Cerrar</span> </div> <iframe src="redirect.jsp?u=//webapp.urp.edu.pe/sclv/?m=cambiarclave1" frameborder="0" width="100%" scrolling="no" height="470"></iframe>',
        html: strtext,
        customClass: 'swal-wide',
        //type: 'warning',
        showCancelButton: false,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Cerrar',
        buttonsStyling: false,
        showConfirmButton: false,
        showCloseButton: true,
        width: '88%',
        height: '97%',
        left: '5%',
        buttons: {
            confirm: {
                className: 'btn btn-success'
            }
        }
    });
}


function cerrarPopup(idpopup) {
    swal.clickCancel();
    //$('#bootstrap-show-modal-0').modal('hide');
    //$('#divpopup' + idpopup).dialog("destroy");

    document.getElementById("divallcontainer").style.display = "";
    //document.body.style.display="";
}
function cargarLogin() {
    document.location.href = "login";
}


function cargarCambioContrasenia(cambioclv1, tipo) {
    validarSesion();
    if (!sesionValida)
        return;
    swal({
        title: "Cambio de Primera Clave",
        //text: '<div style="text-align:right;padding:5px 0 5px 0;margin-bottom:5px;"><span onclick="cargarLogin()" style="border-width:1px;border-style:solid;margin:0px; padding:5px; border-color:#CCCCCC;cursor:pointer;">Cerrar</span> </div> <iframe src="redirect.jsp?u=//webapp.urp.edu.pe/sclv/?m=cambiarclave1" frameborder="0" width="100%" scrolling="no" height="470"></iframe>',
        html: '<iframe src="redirect.jsp?u=//webapp.urp.edu.pe/sclv/?m=cambiarclave1" frameborder="0" width="100%" scrolling="no" height="470"></iframe>',
        customClass: 'swal-wide',
        //type: 'warning',
        showCancelButton: false,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Cerrar',
        buttonsStyling: false,
        allowOutsideClick: false,
        buttons: {
            confirm: {
                className: 'btn btn-success'
            }
        }
    });

}
function showClaveSecundario(tipo) {
    swal({
        title: "Cambio de Segunda Clave",
        //text: '<div style="text-align:right;padding:5px 0 5px 0;margin-bottom:5px;"><span onclick="cargarLogin()" style="border-width:1px;border-style:solid;margin:0px; padding:5px; border-color:#CCCCCC;cursor:pointer;">Cerrar</span> </div> <iframe src="redirect.jsp?u=//webapp.urp.edu.pe/sclv/?m=cambiarclave1" frameborder="0" width="100%" scrolling="no" height="470"></iframe>',
        html: '<IFRAME class="embed-responsive-item" src="redirect.jsp?u=//webapp.urp.edu.pe/sclv/?m=cambiarclave2" frameBorder=0 width="100%"  style="height:450px;" scrolling=no ></IFRAME>',
        customClass: 'swal-wide',
        //type: 'warning',
        showCancelButton: false,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Cerrar',
        buttonsStyling: false,
        allowOutsideClick: false,
        buttons: {
            confirm: {
                className: 'btn btn-success'
            }
        }
    });
}


function cargarPagina(url) {
    validarSesion();
    if (!sesionValida)
        return;
    window.open(url, '453', "alwaysRaised=yes,hotkeys=0,menubar=0,resizable,width=" + -40 + ",height=" + -10 + ",scrollbars,top=0,left=0");
}
function sendEmailto() {
    new Ajax.Request('enviarCorreoSave.jsp', {
        method: "post",
        parameters: {
            correoper: document.getElementById("txtemailper").value,
            correourp: document.getElementById("txtemailurp").value,
            clv: document.getElementById("clv").value
        },
        onSuccess: function (t) {
            var data = t.responseText.evalJSON();
            if (data.resultado == "true") {
                parent.cerrarPopup('705');
            } else {
                alert("Error al enviar, no se ha podido enviar");
            }
        }
    });
}
function cargarCurvaAprendisaje() {
    $("#myChart").innerHTML = '<div class="spinner-border text-success" role="status"> <span class="sr-only">Loading...</span></div>';
    $.ajax({
        url: 'curvaAprendisaje.jsp',
        type: "POST",
        jsonp: "callback",
        cache: false,
        dataType: "json",
        data: ({
            usr: ""
        }),
        success: function (transport) {

            var ctx = document.getElementById('myChart').getContext("2d");
            var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
            gradientStroke.addColorStop(0, "#52D1B7"); //52D1B7
            gradientStroke.addColorStop(1, "#52D1B7");
            var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
            gradientFill.addColorStop(0, "rgba(82, 209, 183, 0.4)");
            gradientFill.addColorStop(1, "rgba(82, 209, 183, 0.4)");
            //http://themepixels.me/bracketplus/app/chart-chartjs.html
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: transport.labels,
                    datasets: [{
                            borderColor: gradientStroke,
                            pointBorderColor: gradientStroke,
                            pointBackgroundColor: gradientStroke,
                            pointHoverBackgroundColor: gradientStroke,
                            pointHoverBorderColor: gradientStroke,
                            pointBorderWidth: 8,
                            pointHoverRadius: 10,
                            pointHoverBorderWidth: 1,
                            pointRadius: 3,
                            fill: true,
                            backgroundColor: gradientFill,
                            borderWidth: 3,
                            label: "Promedio Ponderado",
                            data: transport.data
                        }]
                },
                options: {
                    legend: {
                        position: "bottom"
                    },
                    scales: {
                        yAxes: [{
                                ticks: {
                                    fontColor: "rgba(0,0,0,0.5)",
                                    fontStyle: "bold",
                                    beginAtZero: true,
                                    maxTicksLimit: 10,
                                    padding: 20,
                                    fontSize: 10,
                                    min: 0, //transport.min - 1,
                                    max: 20, //transport.max + 2,
                                    stepSize: 4
                                },
                                gridLines: {
                                    drawTicks: true,
                                    display: true,
                                    stepSize: 2,
                                    color: ['#E5E5E5', '#E5E5E5', '#F49B8B', '#E5E5E5', '#E5E5E5', '#E5E5E5', '#E5E5E5'] // the line color series
                                }
                            }],
                        xAxes: [{
                                gridLines: {
                                    zeroLineColor: "transparent"
                                },
                                ticks: {
                                    padding: 20,
                                    fontColor: "rgba(0,0,0,0.5)",
                                    fontStyle: "bold"
                                }
                            }]
                    },
                    animation: {
                        easing: "easeInOutBack"
                    }
                }
            });

        }
    });
}

function cargarDataHorario() {

    $.ajax({
        url: 'intranet/hrariocls.jsp',
        type: "POST",
        jsonp: "callback",
        cache: false,
        //dataType: "json",
        data: ({
            params: Encryptor.encodeHsh('codigo==sdfsfs&tu==asdfsflu')
        }),
        success: function (transport) {
            var jsonText = Encryptor.decodeHsh(transport);
            var json = jQuery.parseJSON(jsonText);
            var mascaraAnterior = "";
            var colorCounter = 0;

            var jsonHorario = "";
            var color = "";
            var horaInit = 99;
            var colors = ["#2488CA", "#1ABC9C", "#27AE60", "#2ECC71", "#CCDB38", "#385AB1", "#C0392B", "#9B59B6", "#935116", "#717D7E", "#1D8348", "#148F77", "#1A5276"];//3498DB

            for (var i = 0; i < json.root.length; i++) {
                var row = json.root[i];
                if (mascaraAnterior !== row.mascara) {
                    color = colors[colorCounter++];
                }
                var horaNow = parseInt(row.horaInicio.split(":")[0]);
                if (horaNow < horaInit) {
                    horaInit = horaNow;
                }
                var dia = parseInt(row.dia);
                dia = dia === 1 ? 8 : dia;//si es 1:domingo ==>8
                var fecha = "2018-07-0" + dia;
                var docentes = row.docentes;
                var docenteNombres = "";
                for (var k = 0; k < docentes.length; k++) {
                    docenteNombres = docenteNombres == "" ? "" : "--";
                    docenteNombres = docentes[k].apellidoPaterno + " " + docentes[k].apellidoMaterno + ", " + docentes[k].nombre;
                }
                var ambiente = row.descripcionAmbiente;
                ambiente = (ambiente === null ? "" : ambiente);
                jsonHorario += jsonHorario === "" ? "" : ",";
                jsonHorario += "{\"title\": \"" + row.mascara + "-" + row.ctsug_codigo + "  " + row.cursNomb + "\",\"start\": \"" + fecha + "T" + row.horaInicio + ":00\",\"end\": \"" + fecha + "T" + row.horaFin + ":00\",\"color\":\"" + color + "\",\"id\":\"" + i + "\",\"curso\":\"" + row.mascara + ' - ' + row.cursNomb + "\",\"grupo\":\"" + row.grupo + "\",\"subgrupo\":\"" + row.subgrupo + "\",\"aula\":\"" + ambiente + "\",\"tipo\":\"" + row.ctsug_codigo + "\",\"docentes\":\"" + docenteNombres + "\"}";
                mascaraAnterior = row.mascara;
            }
            if (horaInit.length === 1) {
                horaInit = "0" + horaInit;
            }
            inicializeCalendar("[" + jsonHorario + "]", horaInit + ":00:00");

        }
    });


}


function actualizarConfigUser(id, npopu_codigo, dpopu_expira) {
    $.ajax({
        url: 'grabarConfigUser.jsp',
        type: "POST",
        jsonp: "callback",
        cache: false,
        dataType: "text",
        data: ({
            idpopup: npopu_codigo,
            expira: dpopu_expira,
            key: "news"
        }),
        success: function (transport) {
            var idPopup = "popup" + id;
            $("#" + idPopup).fadeOut(800, "linear", function () {
                document.getElementById(idPopup).style.display = "none";
            });
        }
    });
}
function cerrarInformImportante(id) {
    var idPopup = "popupII" + id;
    $("#" + idPopup).fadeOut(800, "linear", function () {
        document.getElementById(idPopup).style.display = "none";
    });
}

function saveconfig(key, value) {
    $.ajax({
        url: 'grabarConfigUser.jsp',
        type: "POST",
        jsonp: "callback",
        cache: false,
        dataType: "json",
        data: ({
            key: key,
            value: value
        }),
        success: function (transport) {

        }
    });
}
function fechaHoy() {
    var dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    var today = new Date();
    var day = today.getDay() === 0 ? 7 : today.getDay();
    var result = dias[day - 1] + " " + String(today.getDate()).padStart(2, '0') + " de " + meses[today.getMonth() ] + " de " + today.getFullYear();
    return result;
}


//====================API for Search Filter===================
var mouseOver = false;
function setMouseOverOnFilterBox(state) {
    mouseOver = state;
}
function hideSearchFilterPanel() {
    if (mouseOver === false) {
        $("#searhfilterpanel").removeClass("show");
    }
}
function showSearchFilter() {
    var txt = $('#txtSearchBox').val();
    if (txt === "") {
        $("#searhfilterpanel").removeClass("show");
    } else {
        $("#searhfilterpanel").addClass("show");
    }
}
function filtraropciones(event, txt, tb, colum) {
    txt = txt.toUpperCase();
    if (txt === "") {
        $("#searhfilterpanel").removeClass("show");
        return;
    }
    /*==========search filter======*/
    $("#searhfilterpanel").addClass("show");
    var key = event.which || event.keyCode;

    var searhfilterpanel = document.getElementById("searhfilterpanel");
    var linodesall = searhfilterpanel.querySelectorAll("li");
    var exists = false;
    linodesall.forEach(function (li, b, c) {
        li.classList.remove("d-none");
        if (key !== 13 && key !== 38 && key !== 40) {
            li.classList.remove("active");
        }
        if (li.innerText.toUpperCase().includes(txt)) {
            li.classList.remove("d-none");
            exists = true;
        } else {
            li.classList.add("d-none");
        }
    });
    if (exists === false) {
        $("#searhfilterpanel").removeClass("show");
        return;
    }
    var linodes = searhfilterpanel.querySelectorAll("li:not(.d-none)");
    var pos = 0;
    var posanterior = -1;
    if (key === 38) {/*key up*/
        linodes.forEach(function (li, b, c) {
            if (li.classList.contains("active")) {
                posanterior = b;
                pos = b - 1;
            }
        });
        if (pos > -1) {
            linodes[pos].classList.add("active");
            linodes[posanterior].classList.remove("active");
        }
    } else if (key === 40) {/*key dowm*/
        linodes.forEach(function (li, b, c) {
            if (li.classList.contains("active")) {
                posanterior = b;
                pos = b + 1;
            }
        });
        //console.log(posanterior+"_"+pos+"___"+linodes.length);
        if (pos < linodes.length) {
            linodes[pos].classList.add("active");
            if (posanterior > -1)
                linodes[posanterior].classList.remove("active");
        }

    } else if (key === 13) {/*key enter*/
        var searhfilterpanel = document.getElementById("searhfilterpanel");
        var nodeslected = searhfilterpanel.querySelectorAll("li.active");
        txt = nodeslected[0].innerText;
        execSearch(txt);
    }
}
function execSearch(txt) {
    $('#txtSearchBox').val("");
    $("#searhfilterpanel").removeClass("show");
    /*==========for each to botonera*/
    var container = document.querySelector("ul.nav");
    var categoriasNodes = container.querySelectorAll("li.nav-item > div.collapse");
    categoriasNodes.forEach(function (categoria, b, c) {
        categoria.className = "collapse";
        //categoria.className.replace(/\bshow\b/g, "");
        var spanNodes = categoria.querySelectorAll("ul.nav > li.nav-item > a.nav-link > span.sidebar-normal");
        spanNodes.forEach(function (span, b, c) {
            span.parentElement.parentElement.className = "nav-item";
            //span.parentElement.parentElement.className.replace(/\bd-none\b/g, "");

        });
    });
    //var nodes = container.querySelectorAll("li.nav-item > div.collapse > ul.nav > li.nav-item > a.nav-link > span.sidebar-normal");
    categoriasNodes.forEach(function (categoria, b, c) {
        categoria.className = "collapse";
        var spanNodes = categoria.querySelectorAll("ul.nav > li.nav-item > a.nav-link > span.sidebar-normal");
        spanNodes.forEach(function (span, b, c) {
            if (span.innerHTML.toUpperCase().includes(txt.toUpperCase())) {
                span.parentElement.parentElement.parentElement.parentElement.className = "collapse show";
                span.parentElement.parentElement.className = "nav-item active";
                span.parentElement.parentElement.click();
            } else {
                //span.parentElement.parentElement.className="nav-item d-none";
            }
        });
    });
}
function displayThisOption(el) {
    execSearch(el.innerHTML);
}
/*_________________________camara escaner___________________*/
var scanning = false;
var video = document.createElement("video");
function encenderCamara(){
    navigator.mediaDevices
            .getUserMedia({video: {facingMode: "environment"}})
            .then(function (stream) {
                scanning = true;
                //btnScanQR.hidden = true;
                document.getElementById("qr-canvas").hidden = false;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.srcObject = stream;
                video.play();
                tick();
                scan();
            });
};
//funciones para levantar las funciones de encendido de la camara
function tick() {
    var canvasElement = document.getElementById("qr-canvas");
    var canvas = canvasElement.getContext("2d");
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    scanning && requestAnimationFrame(tick);
}
function scan() {
    try {
        qrcode.decode();
    } catch (e) {
        setTimeout(scan, 300);
    }
}
const cerrarCamara = () => {
    video.srcObject.getTracks().forEach((track) => {
        track.stop();
    });
    var canvasElement = document.getElementById("qr-canvas");
    canvasElement.hidden = true;
    //btnScanQR.hidden = false;
};
const activarSonido = () => {
    var audio = document.getElementById('audioScaner');
    audio.play();
}
qrcode.callback = (respuesta) => {
    if (respuesta) {
        console.log(respuesta);
        //Swal.fire(respuesta)
        //$("#txtSearchBox").val(Encryptor.decodeHsh(respuesta));
        //buscarUsuarioXCodigo2();
        activarSonido();
        //$("#txtSearchBox").focus();
        cerrarCamara();
        /*clearTimeout(timerInterno);
        timerInterno = setInterval(function () {
            encenderCamara();
            if (timerInterno != null) {
                clearTimeout(timerInterno);
                timerInterno != null;
            }
        }, (1000) * (5));*/
    }
};
//evento para mostrar la camara sin el boton 
window.addEventListener('load', (e) => {
    //encenderCamara();
});

/*_______________fin scaner qr_________________________*/
function openQR(codigo) {
    var html='<audio id="audioScaner" src="images/sonido.mp3"></audio>';
    html+=' <ul class="nav nav-pills nav-pills-icons" role="tablist">';
    html+='     <li class="nav-item d-none"><a class="nav-link " href="#dashboard-1" role="tab" data-toggle="tab">SCAN</a></li>';
    html+='     <li class="nav-item d-none"><a class="nav-link active" href="#schedule-1" role="tab" data-toggle="tab">QR</a></li>   ';
    html+=' </ul>';
    html+=' <div class="tab-content tab-space">';
    html+='     <div class="tab-pane " id="dashboard-1"><canvas hidden="" id="qr-canvas" class="img-fluid8 " style="width:100%"></canvas></div>';
    html+='     <div class="tab-pane active" id="schedule-1"><div id="qrcode" style="width:100% margin-top:15px;"></div></div>   ';
    html+=' </div> ';
    swal({
        title: "<h4><b>Usa este QR para identificarte en la puerta de ingreso a la Universidad, focaliza tu QR a la cámara en la pantalla de identificación</b></h4>",
        html: '<div align="center">'+html+'</div>',
        customClass: 'swal-wide',
        showCancelButton: false,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Cerrar',
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: true,
        buttons: {
            confirm: {
                className: 'btn btn-success'
            }
        }
    });

    var width=document.getElementsByClassName("tab-content")[0].offsetWidth;
    console.log(width);
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: width,
        height: width
    });
    var hash = Encryptor.encodeHsh(codigo);
    qrcode.makeCode(hash);
    //encenderCamara();
}

