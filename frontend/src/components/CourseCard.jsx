import { useNavigate } from 'react-router-dom';
import { Box, HStack, Image, VStack, Heading, Text } from '@chakra-ui/react';

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
      <Image src={course.image} alt={course.name}
        h= {48} w='full'
        objectFit='cover' />
      <Box p={4}>
        <Heading as='h3' size='md' mb={2}>
          {course.title}
        </Heading>
        <Text fontWeight='bold' fontSize='md' color='gray.100' mb={4}>
          by {course.author?.name || "Unknown author"}
      </Text>
      </Box>
    </Box>
  )
}

export default CourseCard;