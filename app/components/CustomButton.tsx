// CustomButton.tsx
import React from 'react';
import {
	TouchableOpacity,
	Text,
	TouchableOpacityProps,
	StyleSheet,
	Image,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CustomButtonProps extends TouchableOpacityProps {
	title: string;
}

const TransferBtn: React.FC<CustomButtonProps> = ({title, ...props}) => {
	return (
		<TouchableOpacity style={styles.transferBtn} {...props}>
			<Icon
				name="arrow-circle-up"
				size={24}
				color="#8846f0"
				style={{transform: [{rotate: '45deg'}]}}
			/>
			<Text style={styles.transferBtnTxt}>{title}</Text>
		</TouchableOpacity>
	);
};

const BackBtn: React.FC<CustomButtonProps> = ({title, ...props}) => {
	return (
		<TouchableOpacity style={styles.backBtn} {...props}>
			<Text style={styles.backBtnTxt}>{title}</Text>
		</TouchableOpacity>
	);
};

const WithdrawBtn: React.FC<CustomButtonProps> = ({title, ...props}) => {
	return (
		<TouchableOpacity style={styles.transferBtn} {...props}>
			<Icon
				name="arrow-circle-down"
				size={24}
				color="#8846f0"
				style={{transform: [{rotate: '45deg'}]}}
			/>
			<Text style={styles.transferBtnTxt}>{title}</Text>
		</TouchableOpacity>
	);
};

const DepositBtn: React.FC<CustomButtonProps> = ({title, ...props}) => {
	return (
		<TouchableOpacity style={styles.transferBtn} {...props}>
			<Icon
				name="arrow-circle-down"
				size={24}
				color="#8846f0"
				style={{transform: [{rotate: '90deg'}]}}
			/>
			<Text style={styles.transferBtnTxt}>{title}</Text>
		</TouchableOpacity>
	);
};

const SignInBtn: React.FC<CustomButtonProps> = ({title, ...props}) => {
	return (
		<TouchableOpacity style={styles.signInBtn} {...props}>
			<Text style={styles.signInBtnTxt}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	transferBtn: {
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		backgroundColor: 'white', // Set your desired background color
		borderRadius: 24,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		padding: 8,
	},
	transferBtnTxt: {
		color: 'black', // Set your desired text color
		fontSize: 16,
		fontWeight: 'bold',
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		letterSpacing: 1,
	},
	backBtn: {
		width: '37.5%',
		height: 50,
		flexDirection: 'column',
		backgroundColor: 'black', // Set your desired background color
		borderRadius: 24,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		padding: 8,
	},
	backBtnTxt: {
		color: 'white', // Set your desired text color
		fontSize: 16,
		fontFamily: 'Nunito-Black',
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		letterSpacing: 1,
	},

	button2: {
		width: '25%',
		height: 60,
		backgroundColor: '#00ffa8', // Set your desired background color
		padding: 10,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText2: {
		color: 'black', // Set your desired text color
		fontSize: 14,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
	signInBtn: {
		width: '80%',
		height: 50,
		backgroundColor: 'black', // Set your desired background color
		padding: 10,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	signInBtnTxt: {
		color: 'white', // Set your desired text color
		fontSize: 14,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
	appleLogin: {
		flexDirection: 'row',
		width: '80%',
		height: 50,
		backgroundColor: 'white', // Set your desired background color
		padding: 10,
		borderRadius: 24,
		borderColor: 'black',
		borderWidth: 2,
		marginTop: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	googleLogin: {
		flexDirection: 'row',
		width: '80%',
		height: 50,
		backgroundColor: 'white', // Set your desired background color
		padding: 10,
		borderRadius: 24,
		borderColor: 'black',
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	continueTxt: {
		color: 'black', // Set your desired text color
		fontSize: 13,
		fontWeight: 'normal',
		letterSpacing: 1,
	},
});

export {TransferBtn, SignInBtn, WithdrawBtn, DepositBtn, BackBtn};
