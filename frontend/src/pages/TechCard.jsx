function TechCard({title,text}){

return(

<div

className="
bg-white
rounded-2xl
p-6
shadow-md
"

>

<h3 className="
font-bold
text-xl
text-purple-600
">

{title}

</h3>


<p className="
mt-2
text-gray-600
">

{text}

</p>


</div>

)

}

export default TechCard;