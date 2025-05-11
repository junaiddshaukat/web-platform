export default function AdminDashboard() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-2">
            <p>Total Events: 100+</p>
            <p>Community Members: 20k+</p>
            <p>Expert Speakers: 30+</p>
          </div>
        </div>
        
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <p>New Members: 50</p>
            <p>Upcoming Events: 5</p>
            <p>Active Sessions: 3</p>
          </div>
        </div>
        
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2">
            <p>Server Status: Online</p>
            <p>Database: Connected</p>
            <p>Last Backup: 2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
} 