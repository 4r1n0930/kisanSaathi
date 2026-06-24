import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    flex: 1,
    padding: 24,
  },
  scroll: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 24,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacerSmall: {
    height: 12,
  },
  spacer: {
    height: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fbfaf2',
    borderRadius: 14,
    padding: 14,
    color: colors.text,
    fontSize: 16,
  },
  errorText: {
    color: colors.danger,
    marginTop: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginTop: 12,
  },
  helperText: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 8,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
});
