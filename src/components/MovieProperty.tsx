interface MoviePropertyProps {
  label: string;
  value: string;
}
const MovieProperty = (props: MoviePropertyProps) => {
  const { label, value } = props;
  return (
    <p style={{ maxWidth: 250 }}>
      <span style={{ display: 'block', fontWeight: 700 }}>{label}</span>
      <span>{value}</span>
    </p>
  );
};

export default MovieProperty;
