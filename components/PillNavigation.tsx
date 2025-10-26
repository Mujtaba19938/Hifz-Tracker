import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { BookOpen, Home, Pencil, ClipboardList } from 'lucide-react-native';
import colors from '@/constants/colors';

interface PillNavigationProps {
  style?: any;
}

export default function PillNavigation({ style }: PillNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  console.log('PillNavigation rendered, pathname:', pathname);

  const HomeworkIcon = ({ active }: { active: boolean }) => (
    <View style={{ width: 24, height: 24 }}>
      <BookOpen size={24} color={active ? colors.primary : colors.white} />
      <View style={{ position: 'absolute', left: 6, top: 4 }}>
        <Pencil size={14} color={active ? colors.primary : colors.white} />
      </View>
    </View>
  );

  const ActivityIcon = ({ active }: { active: boolean }) => (
    <View style={{ width: 24, height: 24 }}>
      <ClipboardList size={24} color={active ? colors.primary : colors.white} />
      <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
        <Pencil size={12} color={active ? colors.primary : colors.white} />
      </View>
    </View>
  );

  const navigationItems = [
    {
      id: 'class-selection',
      route: '/(tabs)/class-selection',
      icon: Home,
      label: 'Class',
    },
    {
      id: 'activity',
      route: '/(tabs)/activity',
      icon: ActivityIcon as any,
      label: 'Activity',
    },
    {
      id: 'homework',
      route: '/(tabs)/homework',
      icon: HomeworkIcon as any,
      label: 'Homework',
    },
  ];

  const isActive = (route: string) => {
    return pathname === route;
  };

  const handleNavigation = (route: string, index: number) => {
    // Animate underline immediately on press for responsiveness
    const left = itemLefts.current[index];
    const inner = iconInnerCenters.current[index];
    let center: number | undefined;
    if (typeof left === 'number' && typeof inner === 'number') {
      center = left + inner;
    }
    if (typeof center === 'number') {
      const targetX = center - ACTIVE_PILL_WIDTH / 2;
      Animated.timing(activeTranslateX, {
        toValue: targetX,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    router.push(route as any);
  };

  // Animated active pill (measured for perfect alignment)
  const ACTIVE_PILL_WIDTH = 28;
  const ACTIVE_PILL_HEIGHT = 6;
  const activeTranslateX = React.useRef(new Animated.Value(0)).current;
  const activeOpacity = React.useRef(new Animated.Value(0)).current;
  const itemLefts = React.useRef<number[]>([]);
  const iconInnerCenters = React.useRef<number[]>([]);
  const [measuredCount, setMeasuredCount] = React.useState(0);

  const handleItemLayout = (index: number, e: any) => {
    const { x } = e.nativeEvent.layout;
    itemLefts.current[index] = x;
    setMeasuredCount((c) => {
      const next = c + 1;
      // When all items measured, fade in active pill
      if (next >= navigationItems.length && iconInnerCenters.current.filter(v => typeof v === 'number').length >= navigationItems.length) {
        Animated.timing(activeOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
      return next;
    });
  };

  const handleIconLayout = (index: number, e: any) => {
    const { x, width } = e.nativeEvent.layout;
    iconInnerCenters.current[index] = x + width / 2;
    // If all outer and inner measurements exist, show active pill
    if (
      itemLefts.current.filter(v => typeof v === 'number').length >= navigationItems.length &&
      iconInnerCenters.current.filter(v => typeof v === 'number').length >= navigationItems.length
    ) {
      Animated.timing(activeOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const animateActivePillToRoute = React.useCallback(() => {
    const activeIndex = navigationItems.findIndex((i) => i.route === pathname);
    if (activeIndex < 0) return;
    let center: number | undefined;
    const left = itemLefts.current[activeIndex];
    const inner = iconInnerCenters.current[activeIndex];
    if (typeof left === 'number' && typeof inner === 'number') {
      center = left + inner;
    }
    if (typeof center !== 'number') {
      // Fallback: approximate center using item width + margins
      const itemWidth = styles.navItem.width as number; // 50
      const margin = 2 * 2; // left+right margins total
      const startPadding = (styles.pillContainer.padding as number) ?? 8;
      center = startPadding + activeIndex * (itemWidth + margin) + itemWidth / 2;
    }
    const targetX = center - ACTIVE_PILL_WIDTH / 2;
    Animated.timing(activeTranslateX, {
      toValue: targetX,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [pathname]);

  React.useEffect(() => {
    // try animating whenever route changes or after measurements update
    animateActivePillToRoute();
  }, [pathname, measuredCount, animateActivePillToRoute]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.pillContainer}>
        {/* Animated underline bar under icons */}
        <Animated.View
          style={[
            styles.activePill,
            { width: ACTIVE_PILL_WIDTH, height: ACTIVE_PILL_HEIGHT, opacity: activeOpacity, transform: [{ translateX: activeTranslateX }] },
          ]}
          pointerEvents="none"
        />
        {navigationItems.map((item, index) => {
          const IconComponent: any = item.icon;
          const active = isActive(item.route);
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                active && styles.navItemActive,
                index === 0 && styles.firstItem,
                index === navigationItems.length - 1 && styles.lastItem,
              ]}
              onPress={() => handleNavigation(item.route, index)}
              activeOpacity={0.7}
              onLayout={(e) => handleItemLayout(index, e)}
            >
              <View onLayout={(e) => handleIconLayout(index, e)}>
                {IconComponent === HomeworkIcon ? (
                  <HomeworkIcon active={active} />
                ) : IconComponent === ActivityIcon ? (
                  <ActivityIcon active={active} />
                ) : (
                  <IconComponent
                    size={24}
                    color={active ? colors.primary : colors.white}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
    padding: 8,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activePill: {
    position: 'absolute',
    left: -2,
    bottom: 6,
    backgroundColor: colors.white,
    borderRadius: 24,
    zIndex: 0,
  },
  activeContent: {
    position: 'absolute',
    left: 0,
    top: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 6,
  },
  navItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  navItemActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  firstItem: {
    marginLeft: 0,
  },
  lastItem: {
    marginRight: 0,
  },
});
