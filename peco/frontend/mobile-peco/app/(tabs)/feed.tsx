
import { useNavigation } from '@react-navigation/native';
import HomeFeedScreen from '../../src/screens/HomeFeedScreen';

export default function FeedTab() {
  const navigation = useNavigation();
  return <HomeFeedScreen navigation={navigation} />;
}
