import { motion } from "framer-motion";

function FeatureCard({icon, title, description}) {

return (

<motion.div

whileHover={{y:-8}}

className="
bg-white
rounded-3xl
p-6
shadow-lg
border
border-pink-100
"

>

<div className="
bg-pink-100
w-12
h-12
rounded-full
flex
items-center
justify-center
text-pink-500
mb-4
">

{icon}

</div>


<h3 className="
text-xl
font-bold
text-amber-900
">

{title}

</h3>


<p className="
mt-3
text-gray-600
">

{description}

</p>


</motion.div>

)

}

export default FeatureCard;