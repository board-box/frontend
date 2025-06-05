import { StyleSheet } from 'react-native';
const mainColors = {
	orange: '#FF8C55',
	blue: '#064151',
	lightBlue: '#35BBEE',
};

const secondaryColors = {
	lightOrange: '#FFD3BE',
	orange: '#FF6E29',
	blue: '#0089BD',
	lightBlue: '#AEE9FF',
	darkOrange: '#FF5200',
	gray: '#99C1D0',
	lightGray: '#E4E4E4',
};

const grayButton = StyleSheet.create({
	button: {
		backgroundColor: '#E4E4E4',
		...Platform.select({
	      ios: {
	        shadowColor: '#064151',
	        shadowOpacity: 0.28,
	        shadowOffset: { width: 0, height: 10 },
	        shadowRadius: 30,
	      },
	      android: {
	        elevation: 10,
	      },
	    }),
	},
});

const fonts = {
  	main: {
  		regular: 'Rubik-Regular',
  		bold: 'Rubik-Bold', 
  		italic: 'Rubik-Italic',
	},
  	secondary: {
		regular: 'Mulish-Regular',
  		bold: 'Mulish-Bold',
  		italic: 'Mulish-Italic',
  	},
  	logo: 'PoetsenOne',
};

export default {
	mainColors,
	secondaryColors,
	grayButton,
	fonts,
};