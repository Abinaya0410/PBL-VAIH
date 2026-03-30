import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex items-center gap-4"
    >
      <div className="bg-indigo-500/20 p-3 rounded-lg">
        <Icon className="text-indigo-400" size={26} />
      </div>

      <div>
        <p className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}