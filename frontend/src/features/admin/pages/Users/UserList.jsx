
import UserFilterBar from '../../components/UserFilterBar';
import UserKPISummary from '../../components/UserKPISummary';
import UserTable from '../../components/UserTable';
import UserRightWidgets from '../../components/UserRightWidgets';

export default function UserList() {
  return (
    <main className="p-8 space-y-6 flex-1">

      {/* Filter */}
      <UserFilterBar />

      {/* KPI */}
      <UserKPISummary />

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* User Table */}
        <UserTable />

        {/* Right Widgets */}
        <UserRightWidgets />

      </div>

    </main>
  );
}