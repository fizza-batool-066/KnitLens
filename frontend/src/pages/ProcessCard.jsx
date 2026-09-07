import { motion } from "framer-motion";

function ProcessCard({number,title,text}){

return(

<motion.div

whileHover={{scale:1.05}}

className="
bg-[#FFF7ED]
rounded-3xl
p-6
text-center
"

>

<div className="
text-4xl
font-bold
text-purple-500
">

{number}

</div>


<h3 className="
text-xl
font-bold
text-amber-900
mt-3
">

{title}

</h3>


<p className="
text-gray-600
mt-2
">

{text}

</p>


</motion.div>

)

}

export default ProcessCard;