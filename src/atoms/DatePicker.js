import React, { Component } from "react";
import { TextInput, StyleSheet, View, Modal, Platform, DatePickerIOS, DatePickerAndroid } from "react-native";
import PropTypes from "prop-types";
import { Icon } from "./Icon";
import { commonColors } from "../utils/color";
import { Text } from "./Text";

export class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            modalVisible: false,
            defaultDate: props.defaultDate ? props.defaultDate : new Date(),
            chosenDate: !props.placeholder && props.defaultDate ? props.defaultDate : undefined
        }
    }

    render() {
        const { placeholder, color, modalTransparent, animationType, minimumDate, maximumDate, locale, timeZoneOffsetInMinutes } = this.props;

        if (Platform.OS === "android") {
            return (
                <View style={this.state.focused ? [styles.datePickerAndroid, { borderColor: color, borderWidth: 2 }] : styles.datePickerAndroid}>
                    <Text
                        ref={(c) => this._root = c}
                        style={!this.state.chosenDate ? styles.input : [styles.input, { color: commonColors.black }]}
                        onPress={() => this.openAndroidDatePicker()}
                    >
                        {this.state.chosenDate ? this.formatChosenDate(this.state.chosenDate) : placeholder}
                    </Text>
                    <Icon name="calendar" onPress={() => this.openAndroidDatePicker()} style={styles.icon} color={this.state.focused ? color : commonColors.inputGrey} size={20} />
                </View >
            )
        }
        return (
            <View>
                <View style={this.state.focused ? [styles.datePickerIos, { borderColor: color, borderWidth: 2 }] : styles.datePickerIos} >
                    <Text
                        ref={(c) => this._root = c}
                        style={!this.state.chosenDate ? styles.input : [styles.input, { color: commonColors.black }]}
                        onPress={() => this.openIosDatePicker()}
                    >
                        {this.state.chosenDate ? this.formatChosenDate(this.state.chosenDate) : placeholder}
                    </Text>
                    <Icon onPress={() => this.openIosDatePicker()} name="calendar" style={styles.icon} color={this.state.focused ? color : commonColors.inputGrey} size={20} />
                </View>
                <Modal
                    supportedOrientations={['portrait', 'landscape']}
                    animationType={animationType}
                    transparent={modalTransparent}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { }}
                >
                    <Text
                        onPress={() => this.setState({ modalVisible: false })}
                        style={{ flex: 1 }}
                    />
                    <DatePickerIOS
                        date={this.state.chosenDate ? this.state.chosenDate : this.state.defaultDate}
                        onDateChange={this.setDate.bind(this)}
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                        mode="date"
                        locale={locale}
                        timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
                    />
                    <Text
                        onPress={() => this.setState({ modalVisible: false })}
                        style={{ flex: 1 }}
                    />
                </Modal>
            </View >
        )
    }

    setDate(date) {
        this.setState({ chosenDate: new Date(date) });
        if (this.props.onDateChange) {
            this.props.onDateChange(date);
        }
    }

    openIosDatePicker() {
        this.setState({ modalVisible: true });
    }

    async openAndroidDatePicker() {
        try {
            this.setState({ focused: true });
            const pickedDate = await DatePickerAndroid.open({
                date: this.state.chosenDate ? this.state.chosenDate : this.state.defaultDate,
                minDate: this.props.minimumDate,
                maxDate: this.props.maximumDate,
                mode: this.props.androidMode
            });

            const { action, year, month, day } = pickedDate;

            if (action === DatePickerAndroid.dateSetAction) {
                const selectedDate = new Date(year, month, day);
                this.setDate(selectedDate);
            }
            this.setState({ focused: false });
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
            this.setState({ focused: false });
        }
    }

    formatChosenDate(date) {
        if (this.props.formatChosenDate) {
            return this.props.formatChosenDate(date);
        }
        return [
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear(),
        ].join('/');
    }

}

DatePicker.propTypes = {
    color: PropTypes.string,
    formatChosenDate: PropTypes.func,
    onDateChange: PropTypes.func,
    defaultDate: PropTypes.object,
    minimumDate: PropTypes.object,
    maximumDate: PropTypes.object,
    locale: PropTypes.string,
    modalTransparent: PropTypes.bool,
    androidMode: PropTypes.string,
    animationType: PropTypes.string,
    ...TextInput.propTypes
}

DatePicker.defaultProps = {
    modalTransparent: true,
    color: commonColors.primary,
    animationType: "fade",
    placeholder: "Select Date"
}

const styles = StyleSheet.create({
    datePickerAndroid: {
        width: "100%",
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderColor: commonColors.inputGrey,
        borderWidth: 0.9,
    },
    datePickerIos: {
        width: "100%",
        flexDirection: 'row',
        borderRadius: 15,
        marginVertical: 10,
        borderColor: commonColors.inputGrey,
        borderWidth: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        paddingHorizontal: 10
    },
    icon: {
        paddingRight: 12
    },
    input: {
        flex: 1,
        color: commonColors.inputGrey
    }
})
