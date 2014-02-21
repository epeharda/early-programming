	function getCommData()
	{
		commurl="http://arapahoe/CLICS/CLICS2014A/csl.nsf/CommSchedJSONVw?readviewentries&outputformat=json";		
		
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

				document.getElementById('container').innerHTML= htmlTxt;
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
	htmlTxt=""; 
	var uniqueComm = new Array();
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
		htmlTxt="";	
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
						if(txt!="" && date==today){
							longString= time.trim() + "~" + commRm.trim() + "~" + commName.trim();
							uniqueComm.push(longString);
							shortString= billNum.trim() + "~" + shortTitle.trim();
							uniqueComm.push(shortString);
							//uniqueComm.push(time);
							//uniqueComm.push(commRm);
							//uniqueComm.push(commName);
							//uniqueComm.push(billNum);
							//uniqueComm.push(shortTitle);
						}
					}
				}
			}
		}
		for(var q=0; q<uniqueComm.length;q++)
		{	
			console.log("BEFORE unique adjust: " +uniqueComm[q]); 
		}		


		//getting rid of duplicates
		for(var x=0; x<uniqueComm.length;x++)
		{
			for(var y=x+1; y<uniqueComm.length; y++)
			{
				if(uniqueComm[x]==uniqueComm[y])
				{
					uniqueComm.remove(y);
				}
			}
		}		
		
		for(var r=0; r<uniqueComm.length;r++)
		{	
			console.log("AFTER unique adjust: " +uniqueComm[r]); 
		}

		for(var m=0; m<uniqueComm.length;m++)
		{
			var array=new Array();
			array=uniqueComm[m].split('~');
			if(array.length==3){
														//below I added the <hr> before AND after the title block for horizontal lines
				txt="<li><hr size='3px' color='black'><h3><p class='alignleft'>" + array[0] + "</p><p class='alignright'>  " + array[1] + "</p><div style='clear:both;'></div><p align='center'>" + array[2] + "</p></p></h3><hr size='3px' color='black'></li>";
			}else if(array.length==2){

				txt="<li>" + array[0] + " " + array[1] + "</li>";
			}else if(array.length==1){
				txt="<li>" + array[0] + "</li>"
			}
			htmlTxt+=txt;
		}
		
		htmlTxt="<ul><h2 align='center'><font face='cursive'>Committee Meetings<br>Today</font></h2><br>"+ htmlTxt + "</ul>";	
		//document.getElementById('container').innerHTML = htmlTxt;
	};
	
	$(function(){
		$('#container').vTicker({ 
			speed: 500,
			pause: 3000,
			animation: 'fade',
			mousePause: true,
			showItems: 3
		});
	});
