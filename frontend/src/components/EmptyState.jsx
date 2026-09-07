function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-pink-200 bg-white/70 px-6 py-12 text-center">
      <h3 className="text-xl font-bold text-brown">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-gray-600">{text}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
