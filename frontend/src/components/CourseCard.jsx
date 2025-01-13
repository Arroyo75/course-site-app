import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Box, Image, Heading, Text } from '@chakra-ui/react';

const CourseCard = ({ course }) => {

  const navigate = useNavigate();

  return (
    <Box
      onClick={() => {navigate(`/course/${course._id}`)}}
      shadow='lg'
      rounded='lg'
      overflow='hidden'
      transition='all 0.3s'
      _hover={{ transform: "translateY(-5px)", shadow: "x1"}}
      bg='gray.800'
    >
      <Image src={course.image} alt={course.title}
        h= {48} w='full'
        objectFit='cover' />
      <Box p={4}>
        <Heading as='h3' size='md' mb={2} color="white">
          {course.title}
        </Heading>
        <Text fontWeight='bold' fontSize='md' color='gray.100' mb={4}>
          by {course.author?.name || "Unknown author"}
      </Text>
      </Box>
    </Box>
  )
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  })
}

export default CourseCard;