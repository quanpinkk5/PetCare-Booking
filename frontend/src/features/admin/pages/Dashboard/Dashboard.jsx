
import MetricsCardsRow from '../../components/MetricsCardsRow';
import ChartsSection from '../../components/ChartsSection';
import BottomDetailsRow from '../../components/BottomDetailsRow';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-7">
      <MetricsCardsRow />

      <ChartsSection />

      <BottomDetailsRow />
    </div>
  );
}