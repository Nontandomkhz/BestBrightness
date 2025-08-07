const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 relative overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[30vw] h-[30vw] max-w-96 max-h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-[30vw] h-[30vw] max-w-96 max-h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-[20vw] h-[20vw] max-w-64 max-h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-[25vw] h-[25vw] max-w-80 max-h-80 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default Layout;
