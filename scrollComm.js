	function getCommData()
	{
		commurl="http://arapahoe/CLICS/CLICS2014A/csl.nsf/CommSchedJSON2Vw?readviewentries&outputformat=json";		
		
		commxmlhttp = new XMLHttpRequest(); 
		commxmlhttp.onreadystatechange=function(){	
			
			if(commxmlhttp.readyState==4 && (commxmlhttp.status==200 || window.location.href.indexOf("http")==-1)) 
			{
								//commData=JSON.parse(commxmlhttp.responseText);
				commData=eval('('+commxmlhttp.responseText+')');
				commDoc=commData.viewentry;
				if(commDoc){
					useCommData();
				}else{
					htmlTxt="<ul><li><div><h1>No committee meetings scheduled for today.</h1></div></li></ul>";			
				} 
				//var el=document.getElementById('container');

				document.getElementById('container1').innerHTML= htmlTxt1;
				document.getElementById('container2').innerHTML= htmlTxt2;
				//$(el).html(htmlTxt); 
				//$container.init();
				//var t=setTimeout("getCommData()",3600000); //reload every hour (60000=1min,3600000=1hour)
			}			
		}
		commxmlhttp.open("GET",commurl,true);
		commxmlhttp.setRequestHeader("Cache-Control","no-cache");
		commxmlhttp.send();
		//document.getElementById('container').innerHTML = htmlTxt;
	};

	function useCommData()
	{

	
							
	month = "";
	htmlTxt1="";
	htmlTxt2="";
	var uniqueComm1 = new Array();
	var uniqueComm2 = new Array();
	var d = new Date();
	if((d.getMonth()+1)<10)
	{
		month = "0" + (d.getMonth()+1);
	}
	else
		month = (d.getMonth() + 1);
	
	today = month + "/" + d.getDate() + "/" + d.getFullYear();

	//Title case function for governer's appts
	function toTitleCase(str){
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

		//remove array element function
	Array.prototype.remove=function(from,to){
		var rest= this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
		}; 	
		//
		console.log("alert 10:" + commData);
		for(var i=0; i<commDoc.length;i++){		
			commEntry=commDoc[i].entrydata;			
			if(commEntry[0]["@columnnumber"]=="0") {	
//var txt = commEntry[0].textlist.text[0];
var txt="";
				if(commEntry[0].textlist){
					for(var j=0;j<commEntry[0].textlist.text.length;j++){
						txt=commEntry[0].textlist.text[j][0]
						var commString = new Array();
						commString = txt.split('~');
						var date = commString[0];
						var time = commString[1];
						var commRm =commString[2];
						var commName =commString[3];
						var billNum = commString[4];
						var shortTitle = commString[5];
						if(billNum.charAt(0)=="*"){
							billNum="";
							shortTitle=commString[8];
						}
						if(billNum.charAt(0)=="A"){
							billNum=commString[5] + ":";
							shortTitle=commString[6];
							shortTitle=toTitleCase(shortTitle);
						}	
						//creating an array holding time, room, and committee name
						//now adding an array for House-container1 and Senate-container2
						if(txt!="" && date==today && commName.substring(0,6)!="Senate"){
							longString= time + "~" + commRm + "~" + commName;
							uniqueComm1.push(longString);
							shortString= billNum + "~" + shortTitle;
							uniqueComm1.push(shortString);
						}
						if(txt!="" && date==today && commName.substring(0,5)!="House"){
							longString= time + "~" + commRm + "~" + commName;
							uniqueComm2.push(longString);
							shortString= billNum + "~" + shortTitle;
							uniqueComm2.push(shortString);
						}
					}
				}
			}
		}
		//logging House array before getting rid of duplicates
		for(var q=0; q<uniqueComm1.length;q++)
		{	
			console.log("BEFORE unique adjust HOUSE: " +uniqueComm1[q]); 
		}	
		//logging Senate array before getting rid of duplicates
		for(var q=0; q<uniqueComm2.length;q++)
		{	
			console.log("BEFORE unique adjust SENATE: " +uniqueComm2[q]); 
		}
		//getting rid of duplicates for House- uniqueComm1
		for(var x=0; x<uniqueComm1.length;x++)
		{
			for(var y=x+1; y<uniqueComm1.length; y++)
			{
				if(uniqueComm1[x]==uniqueComm1[y])
				{
					uniqueComm1.remove(y);
				}
			}
		}			
		//getting rid of duplicates for Senate- uniqueComm2
		for(var x=0; x<uniqueComm2.length;x++)
		{
			for(var y=x+1; y<uniqueComm2.length; y++)
			{
				if(uniqueComm2[x]==uniqueComm2[y])
				{
					uniqueComm2.remove(y);
				}
			}
		}	
		//logging House array AFTER getting rid of duplicates
		for(var r=0; r<uniqueComm1.length;r++)
		{	
			console.log("AFTER unique adjust HOUSE: " +uniqueComm1[r]); 
		}
		//logging Senate array AFTER getting rid of duplicates
		for(var r=0; r<uniqueComm2.length;r++)
		{	
			console.log("AFTER unique adjust SENATE: " +uniqueComm2[r]); 
		}
		//assigning House data to htmlTxt1 to be written into html-which is done in getCommData()
		for(var m=0; m<uniqueComm1.length;m++)
		{
			var array=new Array();
			array=uniqueComm1[m].split('~');
			if(array.length==3){
														//below I added the <hr> before AND after the title block for horizontal lines
				txt="<li><hr  size='2px' color='black'></li><li><font size='2.5pt'><b>" + array[0] + " ~ " + array[1] + "</b></font></li><li><p align='center'><font face='Arial' size='3pt'>" + array[2] + "</font></p></li>";
			}else if(array.length==2){
				if(array[0].charAt(0)=="H"){
					txt="<li><font size='2.5pt'><a href='http://arapahoe/CLICS/CLICS2014A/csl.nsf/BillFoldersHouse?openFrameset'>" + array[0] + "</a> " + array[1] + "</font></li>";
				}else if(array[0].charAt(0)=="S"){
					txt="<li><font size='2.5pt'><a href='http://arapahoe/CLICS/CLICS2014A/csl.nsf/BillFoldersSenate?openFrameset'>" + array[0] + "</a> " + array[1] + "</font></li>";
				}else{
				txt="<li><font size='2.5pt'>" + array[0] + " " + array[1] + "</font></li>";
				}
			}else if(array.length==1){
				txt="<li><font size='2.5pt' >" + array[0] + "</font></li>"
			}
			htmlTxt1+=txt;
		}
		//assigning Senate data to htmlTxt1 to be written into html-which is done in getCommData()
		for(var m=0; m<uniqueComm2.length;m++)
		{
			var array=new Array();
			array=uniqueComm2[m].split('~');
			if(array.length==3){
														//below I added the <hr> before AND after the title block for horizontal lines
				txt="<li><hr  size='2px' color='black'></li><li><font size='2.5pt'><b>" + array[0] + " ~ " + array[1] + "</b></font></li><li><p align='center'><font face='Arial' size='3pt'>" + array[2] + "</font></p></li>";
			}else if(array.length==2){
				if(array[0].charAt(0)=="H"){
					txt="<li><font size='2.5pt'><a href='http://arapahoe/CLICS/CLICS2014A/csl.nsf/BillFoldersHouse?openFrameset'>" + array[0] + "</a> " + array[1] + "</font></li>";
				}else if(array[0].charAt(0)=="S"){
					txt="<li><font size='2.5pt'><a href='http://arapahoe/CLICS/CLICS2014A/csl.nsf/BillFoldersSenate?openFrameset'>" + array[0] + "</a> " + array[1] + "</font></li>";
				}else{
				txt="<li><font size='2.5pt'>" + array[0] + " " + array[1] + "</font></li>";
				}
			}else if(array.length==1){
				txt="<li><font size='2.5pt' >" + array[0] + "</font></li>"
			}
			htmlTxt2+=txt;
		}
		//adding the title and opening and closing ul tags to the htmlTxt for both house (htmlTxt1) and senate (htmlTxt2)
		htmlTxt1="<ul><p align='center'><font face='Arial' size='4pt'><b>House Committee Meetings " + today + "</b></font></p><br>"+ htmlTxt1 + "</ul>";
		console.log("House HTML text: " + htmlTxt1);
		htmlTxt2="<ul><p align='center'><font face='Arial' size='4pt'><b>Senate Committee Meetings " + today + "</b></font></p><br>"+ htmlTxt2 + "</ul>";
		console.log("Senate HTML text: " + htmlTxt2);
	};
	
	$(function(){
		$('#container1').vTicker({ 
			speed: 500, /*started at 500*/
			pause: 2000,/*started at 2000*/
			animation: 'fade',
			mousePause: true,
			showItems: 3
		});
	});
	$(function(){
		$('#container2').vTicker({ 
			speed: 500, /*started at 500*/
			pause: 2000,/*started at 2000*/
			animation: 'fade',
			mousePause: true,
			showItems: 3
		});
	});

	function scroll1(){
		/*document.getElementById('container1').innerHTML= htmlTxt1;*/
		document.getElementById('container1').style.overflowY='scroll';
		$(function vTickerStop(){}).ajaxStop(function(){
			$('#container1').vTicker();
		});
	}
	function scroll2(){
		/*document.getElementById('container2').innerHTML= htmlTxt2; This rewrote the html unnecessarily*/
		document.getElementById('container2').style.overflowY='scroll';
		$(function vTickerStop(){}).ajaxStop(function(){
			$('#container2').vTicker();
		});
	}
	
	function noScroll1(){
		document.getElementById('container1').style.overflow='hidden';
	}
	function noScroll2(){
		document.getElementById('container2').style.overflow='hidden';
	}

	
