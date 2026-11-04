import { NavigationContainer } from '@react-navigation/native';

import BadgerTabs from './navigation/BadgerTabs';
import { BadgerNewsProvider } from './BadgerNewsContext';

export default function BadgerNews() {
  return (
    <BadgerNewsProvider>
      <NavigationContainer>
        <BadgerTabs />
      </NavigationContainer>
    </BadgerNewsProvider>
  );
}