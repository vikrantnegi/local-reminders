import React, { Component } from 'react';
import { Platform, StyleSheet, Text, SafeAreaView, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'react-native-firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default class Dashboard extends Component {
  state = {
    enableNotification: true,
    isDateTimePickerVisible: false,
    notificationTime: moment({ hour: 17 }),
  };

  componentDidMount() {
    this.setReminder();
  }

  componentDidUpdate(prevProps, prevState) {
    const { notificationTime, enableNotification } = this.state;

    if (enableNotification !== prevState.enableNotification || notificationTime !== prevState.notificationTime) {
      this.setReminder();
    }
  }

  setReminder = async () => {
    const { notificationTime, enableNotification } = this.state;

    if (enableNotification) {
      firebase.notifications().scheduleNotification(this.buildNotification(), {
        fireDate: notificationTime.valueOf(),
        repeatInterval: 'day',
        exact: true,
      });
    } else {
      return false;
    }
  };

  buildNotification = () => {
    const title = Platform.OS === 'android' ? 'Daily Reminder' : '';
    const notification = new firebase.notifications.Notification()
      .setNotificationId('1')
      .setTitle(title)
      .setBody('This is a notification')
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .android.setChannelId('reminder')
      .android.setAutoCancel(true);

    return notification;
  };

  enableNotification = value => {
    this.setState({
      enableNotification: value,
    });
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.hideDateTimePicker();

    this.setState({
      notificationTime: moment(date),
    });
  };

  render() {
    const { enableNotification, isDateTimePickerVisible, notificationTime } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.cardTitleView}>
          <Text style={styles.cardTitle}>Add Reminder</Text>
        </View>
        <ListItem
          title="Notification"
          bottomDivider
          titleStyle={styles.titleStyle}
          switch={{ onValueChange: this.enableNotification, value: enableNotification }}
        />
        <ListItem
          title="Time"
          titleStyle={styles.titleStyle}
          onPress={this.showDateTimePicker}
          rightElement={<Text style={{ opacity: 0.7 }}>{moment(notificationTime).format('LT')}</Text>}
        />
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="time"
          is24Hour={false}
          date={new Date(notificationTime)}
          titleIOS="Pick your Notification time"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEFF0',
  },
  cardTitleView: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    color: '#585858',
    fontWeight: '600',
  },
  titleStyle: {
    fontSize: 20,
    color: '#585858',
  },
});
